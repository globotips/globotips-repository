import Stripe from "stripe";
import type { Employee } from "@prisma/client";
import { prisma } from "@/lib/db";
import { platformFeeCents } from "@/lib/platform-fee";
import { getStripeMode } from "@/lib/stripe-mode";

const globalForStripe = globalThis as unknown as { stripe?: Stripe };

export function getStripe(): Stripe {
  const mode = getStripeMode();
  if (mode.kind !== "test") {
    throw new Error(
      mode.kind === "blocked"
        ? mode.reason
        : "STRIPE_SECRET_KEY is not set. Demo checkout does not charge cards.",
    );
  }
  if (globalForStripe.stripe) {
    return globalForStripe.stripe;
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!.trim(), {
    typescript: true,
  });
  if (process.env.NODE_ENV !== "production") {
    globalForStripe.stripe = stripe;
  }
  return stripe;
}

export function splitPersonName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: "Staff", lastName: "Member" };
  }
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "Staff" };
  }
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export async function createExpressAccount(employee: Employee): Promise<string> {
  const stripe = getStripe();
  const { firstName, lastName } = splitPersonName(employee.name);
  const account = await stripe.accounts.create({
    type: "express",
    country: "US",
    business_type: "individual",
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    individual: {
      first_name: firstName,
      last_name: lastName,
    },
    business_profile: {
      product_description:
        "Receives guest tips as hotel staff through GloboTips.",
      url: `https://globotips.com/tip/${employee.tipCode}`,
    },
    metadata: {
      employeeId: employee.id,
      hotelId: employee.hotelId,
      tipCode: employee.tipCode,
    },
  });
  return account.id;
}

export async function createAccountOnboardingLink(
  stripeAccountId: string,
  origin: string,
  employeeId: string,
): Promise<string> {
  const stripe = getStripe();
  const link = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `${origin}/admin/connect/refresh?employee=${encodeURIComponent(employeeId)}`,
    return_url: `${origin}/admin/connect/return?employee=${encodeURIComponent(employeeId)}`,
    type: "account_onboarding",
  });
  return link.url;
}

export function accountCanReceiveTips(account: Stripe.Account): boolean {
  return Boolean(account.charges_enabled && account.payouts_enabled);
}

export async function syncEmployeeConnectStatus(employee: Employee): Promise<Employee> {
  if (!employee.stripeAccountId) {
    return employee;
  }
  const stripe = getStripe();
  const account = await stripe.accounts.retrieve(employee.stripeAccountId);
  return prisma.employee.update({
    where: { id: employee.id },
    data: {
      detailsSubmitted: Boolean(account.details_submitted),
      payoutsEnabled: accountCanReceiveTips(account),
    },
  });
}

export async function syncEmployeeByStripeAccountId(
  stripeAccountId: string,
): Promise<Employee | null> {
  const employee = await prisma.employee.findUnique({
    where: { stripeAccountId },
  });
  if (!employee) {
    return null;
  }
  return syncEmployeeConnectStatus(employee);
}

export async function createTipCheckoutSession(input: {
  employee: Employee;
  amountCents: number;
  origin: string;
}): Promise<string> {
  const { employee, amountCents, origin } = input;
  if (!employee.stripeAccountId || !employee.payoutsEnabled) {
    throw new Error("This tip page is not live yet.");
  }
  const stripe = getStripe();
  const fee = platformFeeCents(amountCents);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amountCents,
          product_data: {
            name: `Tip for ${employee.name}`,
            description: "Guest tip via GloboTips. The guest is not surcharged.",
          },
        },
      },
    ],
    payment_intent_data: {
      application_fee_amount: fee,
      transfer_data: {
        destination: employee.stripeAccountId,
      },
      metadata: {
        employeeId: employee.id,
        hotelId: employee.hotelId,
        tipCode: employee.tipCode,
        amountCents: String(amountCents),
        platformFeeCents: String(fee),
      },
    },
    metadata: {
      employeeId: employee.id,
      hotelId: employee.hotelId,
      tipCode: employee.tipCode,
      amountCents: String(amountCents),
      platformFeeCents: String(fee),
    },
    success_url: `${origin}/tip/${encodeURIComponent(employee.tipCode)}?paid=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/tip/${encodeURIComponent(employee.tipCode)}?canceled=1`,
  });
  if (!session.url) {
    throw new Error("Stripe Checkout did not return a URL.");
  }
  return session.url;
}

export async function recordPaidCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<{ amountCents: number } | null> {
  if (session.payment_status !== "paid") {
    return null;
  }
  const employeeId = session.metadata?.employeeId;
  const amountFromMetadata = Number.parseInt(session.metadata?.amountCents ?? "", 10);
  const amountCents = Number.isInteger(amountFromMetadata)
    ? amountFromMetadata
    : session.amount_total;
  if (!employeeId || !amountCents || amountCents < 100) {
    return null;
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;
  const fee = platformFeeCents(amountCents);

  await prisma.tip.upsert({
    where: { stripeCheckoutSessionId: session.id },
    create: {
      employeeId,
      amountCents,
      platformFeeCents: fee,
      status: "paid",
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
    },
    update: {
      status: "paid",
      stripePaymentIntentId: paymentIntentId,
      platformFeeCents: fee,
    },
  });

  return { amountCents };
}

export async function confirmCheckoutSessionForTip(
  tipCode: string,
  sessionId: string,
): Promise<number | null> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.metadata?.tipCode !== tipCode) {
    return null;
  }
  const recorded = await recordPaidCheckoutSession(session);
  return recorded?.amountCents ?? null;
}

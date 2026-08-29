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

function staffContactEmail(employee: Employee): string {
  const local = employee.tipCode.replace(/[^a-z0-9]+/gi, ".").replace(/^\.+|\.+$/g, "");
  return `${local || "staff"}@staff.globotips.com`;
}

export async function createExpressAccount(employee: Employee): Promise<string> {
  const stripe = getStripe();
  const { firstName, lastName } = splitPersonName(employee.name);
  const account = await stripe.v2.core.accounts.create({
    display_name: employee.name,
    contact_email: staffContactEmail(employee),
    dashboard: "express",
    identity: {
      country: "us",
      entity_type: "individual",
      individual: {
        given_name: firstName,
        surname: lastName,
      },
    },
    configuration: {
      recipient: {
        capabilities: {
          stripe_balance: {
            stripe_transfers: { requested: true },
          },
        },
      },
    },
    defaults: {
      currency: "usd",
      responsibilities: {
        fees_collector: "application",
        losses_collector: "application",
      },
      profile: {
        product_description:
          "Receives guest tips as hotel staff through GloboTips.",
        business_url: `https://globotips.com/tip/${employee.tipCode}`,
      },
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
  const link = await stripe.v2.core.accountLinks.create({
    account: stripeAccountId,
    use_case: {
      type: "account_onboarding",
      account_onboarding: {
        configurations: ["recipient"],
        refresh_url: `${origin}/admin/connect/refresh?employee=${encodeURIComponent(employeeId)}`,
        return_url: `${origin}/admin/connect/return?employee=${encodeURIComponent(employeeId)}`,
      },
    },
  });
  if (!link.url) {
    throw new Error("Stripe did not return an onboarding URL.");
  }
  return link.url;
}

export function accountCanReceiveTips(
  account: Stripe.V2.Core.Account,
): boolean {
  const balance = account.configuration?.recipient?.capabilities?.stripe_balance;
  const transfers = balance?.stripe_transfers?.status;
  const payouts = balance?.payouts?.status;
  return transfers === "active" && payouts === "active";
}

export async function retrieveConnectAccount(
  stripeAccountId: string,
): Promise<Stripe.V2.Core.Account> {
  const stripe = getStripe();
  return stripe.v2.core.accounts.retrieve(stripeAccountId, {
    include: ["configuration.recipient", "requirements", "identity"],
  });
}

export async function syncEmployeeConnectStatus(employee: Employee): Promise<Employee> {
  if (!employee.stripeAccountId) {
    return employee;
  }
  const account = await retrieveConnectAccount(employee.stripeAccountId);
  const openRequirements = account.requirements?.entries?.some(
    (entry) => entry.awaiting_action_from === "user",
  );
  return prisma.employee.update({
    where: { id: employee.id },
    data: {
      detailsSubmitted: !openRequirements,
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

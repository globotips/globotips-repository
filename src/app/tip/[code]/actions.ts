"use server";

import { redirect } from "next/navigation";
import { resolveAppOrigin } from "@/lib/app-origin";
import { prisma } from "@/lib/db";
import { MIN_TIP_CENTS, platformFeeCents } from "@/lib/platform-fee";
import { createTipCheckoutSession } from "@/lib/stripe";
import { getStripeMode } from "@/lib/stripe-mode";

export async function recordDemoTipAction(code: string, amountCents: number) {
  if (getStripeMode().kind !== "demo") {
    return {
      ok: false as const,
      error: "Demo checkout is off while Stripe test keys are configured.",
    };
  }
  if (!code || !Number.isInteger(amountCents) || amountCents < MIN_TIP_CENTS) {
    return { ok: false as const, error: "Choose a tip of at least $1." };
  }
  const employee = await prisma.employee.findUnique({
    where: { tipCode: code },
  });
  if (!employee) {
    return { ok: false as const, error: "This tip page is not available." };
  }
  await prisma.tip.create({
    data: {
      employeeId: employee.id,
      amountCents,
      platformFeeCents: platformFeeCents(amountCents),
      status: "paid",
    },
  });
  return { ok: true as const, amountCents };
}

export async function startCheckoutAction(code: string, amountCents: number) {
  const mode = getStripeMode();
  if (mode.kind === "blocked") {
    return { ok: false as const, error: mode.reason };
  }
  if (mode.kind !== "test") {
    return {
      ok: false as const,
      error: "Stripe test keys are not set. Use demo checkout, or add sk_test_ keys.",
    };
  }
  if (!code || !Number.isInteger(amountCents) || amountCents < MIN_TIP_CENTS) {
    return { ok: false as const, error: "Choose a tip of at least $1." };
  }
  const employee = await prisma.employee.findUnique({
    where: { tipCode: code },
  });
  if (!employee) {
    return { ok: false as const, error: "This tip page is not available." };
  }
  if (!employee.stripeAccountId || !employee.payoutsEnabled) {
    return {
      ok: false as const,
      error: "This staff member cannot receive tips yet. The hotel still needs to finish Stripe Connect onboarding.",
    };
  }

  let url: string;
  try {
    url = await createTipCheckoutSession({
      employee,
      amountCents,
      origin: await resolveAppOrigin(),
    });
  } catch {
    return {
      ok: false as const,
      error: "Stripe Checkout could not be started. Check the test keys and try again.",
    };
  }
  redirect(url);
}

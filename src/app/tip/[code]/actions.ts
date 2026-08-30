"use server";

import { prisma } from "@/lib/db";
import { MIN_TIP_CENTS, platformFeeCents } from "@/lib/platform-fee";
import { getStripeMode } from "@/lib/stripe-mode";

export async function recordDemoTipAction(code: string, amountCents: number) {
  if (getStripeMode().kind !== "demo") {
    return {
      ok: false as const,
      error: "Demo checkout is off while Stripe keys are configured.",
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

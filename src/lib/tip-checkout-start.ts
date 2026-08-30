import { resolveStripeRedirectOrigin } from "@/lib/app-origin";
import { prisma } from "@/lib/db";
import { MIN_TIP_CENTS } from "@/lib/platform-fee";
import { createTipCheckoutSession } from "@/lib/stripe";
import { getStripeMode, isStripeEnabled } from "@/lib/stripe-mode";
import {
  TIP_CHECKOUT_PAY_ERRORS,
  type TipCheckoutStartResult,
} from "@/lib/tip-checkout";

export async function startTipCheckoutSession(
  code: string,
  amountCents: number,
): Promise<TipCheckoutStartResult> {
  const mode = getStripeMode();
  if (mode.kind === "blocked") {
    return { ok: false, code: "blocked", error: mode.reason };
  }
  if (!isStripeEnabled(mode)) {
    return { ok: false, code: "keys", error: TIP_CHECKOUT_PAY_ERRORS.keys };
  }
  if (!code || !Number.isInteger(amountCents) || amountCents < MIN_TIP_CENTS) {
    return { ok: false, code: "amount", error: TIP_CHECKOUT_PAY_ERRORS.amount };
  }

  const employee = await prisma.employee.findUnique({
    where: { tipCode: code },
  });
  if (!employee) {
    return { ok: false, code: "unavailable", error: TIP_CHECKOUT_PAY_ERRORS.unavailable };
  }
  if (!employee.stripeAccountId || !employee.payoutsEnabled) {
    return { ok: false, code: "not_ready", error: TIP_CHECKOUT_PAY_ERRORS.not_ready };
  }

  try {
    const url = await createTipCheckoutSession({
      employee,
      amountCents,
      origin: await resolveStripeRedirectOrigin(),
    });
    return { ok: true, url };
  } catch {
    return { ok: false, code: "stripe", error: TIP_CHECKOUT_PAY_ERRORS.stripe };
  }
}

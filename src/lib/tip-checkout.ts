import { MIN_TIP_CENTS } from "@/lib/platform-fee";

export const TIP_CHECKOUT_PATH = "/api/tip/checkout";

export const TIP_CHECKOUT_PAY_ERROR_CODES = [
  "blocked",
  "keys",
  "amount",
  "unavailable",
  "not_ready",
  "stripe",
] as const;

export type TipCheckoutPayErrorCode = (typeof TIP_CHECKOUT_PAY_ERROR_CODES)[number];

export const TIP_CHECKOUT_PAY_ERRORS: Record<TipCheckoutPayErrorCode, string> = {
  blocked:
    "Stripe is blocked. Use sk_test_ locally, or set STRIPE_MODE=live and NODE_ENV=production on the host for live keys.",
  keys: "Stripe keys are not set. Use demo checkout locally, or add sk_test_ keys. Live keys require STRIPE_MODE=live and NODE_ENV=production on the host.",
  amount: "Choose a tip of at least $1.",
  unavailable: "This tip page is not available.",
  not_ready:
    "This staff member cannot receive tips yet. The hotel still needs to finish Stripe Connect onboarding.",
  stripe: "Stripe Checkout could not be started. Check the Stripe keys and try again.",
};

export type TipCheckoutStartResult =
  | { ok: true; url: string }
  | { ok: false; code: TipCheckoutPayErrorCode; error: string };

export function parseTipCheckoutAmount(raw: FormDataEntryValue | null): number | null {
  if (raw == null || raw instanceof File) {
    return null;
  }
  const amountCents = Number.parseInt(String(raw).trim(), 10);
  if (!Number.isInteger(amountCents) || amountCents < MIN_TIP_CENTS) {
    return null;
  }
  return amountCents;
}

export function isTipCheckoutPayErrorCode(value: string): value is TipCheckoutPayErrorCode {
  return (TIP_CHECKOUT_PAY_ERROR_CODES as readonly string[]).includes(value);
}

export function parseTipCheckoutPayError(raw: string | undefined): string | null {
  if (!raw) {
    return null;
  }
  if (isTipCheckoutPayErrorCode(raw)) {
    return TIP_CHECKOUT_PAY_ERRORS[raw];
  }
  return TIP_CHECKOUT_PAY_ERRORS.stripe;
}

export function tipCheckoutErrorRedirectUrl(
  origin: string,
  code: string,
  errorCode: TipCheckoutPayErrorCode,
): string {
  const base = origin.replace(/\/$/, "");
  if (!code) {
    return `${base}/?pay_error=${errorCode}`;
  }
  return `${base}/tip/${encodeURIComponent(code)}?pay_error=${errorCode}`;
}

export function resolveTipCheckoutRedirect(
  result: TipCheckoutStartResult,
  origin: string,
  code: string,
): { url: string; status: 303 } {
  if (result.ok) {
    return { url: result.url, status: 303 };
  }
  return {
    url: tipCheckoutErrorRedirectUrl(origin, code, result.code),
    status: 303,
  };
}

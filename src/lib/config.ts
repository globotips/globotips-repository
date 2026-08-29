export const PUBLIC_TIP_HOST = "globotips.com";

/** Canonical public origin for live-mode Stripe return, refresh, success, and cancel URLs. */
export const LIVE_PUBLIC_ORIGIN = "https://www.globotips.com";

/** Stripe webhook path on the public host. */
export const STRIPE_WEBHOOK_PATH = "/api/webhooks/stripe";

export function displayTipLink(code: string): string {
  return `${PUBLIC_TIP_HOST}/tip/${code}`;
}

export function qrTipUrl(code: string): string {
  const origin = (process.env.TIP_QR_ORIGIN || "https://globotips.com").replace(
    /\/$/,
    "",
  );
  return `${origin}/tip/${code}`;
}

export function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return secret;
}

export const SESSION_COOKIE = "globotips_session";

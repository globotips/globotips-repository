/** Guest-facing host shown in UI, OG, and printed links. */
export const PUBLIC_TIP_HOST = "travelgratuitygroup.com";

/** Canonical public origin for live-mode Stripe return, refresh, success, and cancel URLs. */
export const LIVE_PUBLIC_ORIGIN = "https://www.globotips.com";

/** Stripe webhook path on the public host. */
export const STRIPE_WEBHOOK_PATH = "/api/webhooks/stripe";

const DEFAULT_TIP_QR_ORIGIN = `https://www.${PUBLIC_TIP_HOST}`;

export function tipQrOrigin(): string {
  return (process.env.TIP_QR_ORIGIN || DEFAULT_TIP_QR_ORIGIN).replace(/\/$/, "");
}

export function displayTipLink(code: string): string {
  return `${PUBLIC_TIP_HOST}/tip/${code}`;
}

export function displayJoinLink(token: string): string {
  return `${PUBLIC_TIP_HOST}/join/${token}`;
}

export function qrTipUrl(code: string): string {
  return `${tipQrOrigin()}/tip/${code}`;
}

export function qrJoinUrl(token: string): string {
  return `${tipQrOrigin()}/join/${token}`;
}

export function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return secret;
}

export const SESSION_COOKIE = "globotips_session";

export const PUBLIC_TIP_HOST = "globotips.com";

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

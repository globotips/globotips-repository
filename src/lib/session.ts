import { sessionSecret } from "@/lib/config";

function toBase64Url(bytes: ArrayBuffer): string {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(sessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return toBase64Url(signature);
}

export async function createSessionToken(hotelId: string): Promise<string> {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `${hotelId}.${expiresAt}`;
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function readSessionHotelId(
  token: string | undefined,
): Promise<string | null> {
  if (!token) {
    return null;
  }
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }
  const [hotelId, expiresAt, signature] = parts;
  if (!hotelId || !expiresAt || !signature) {
    return null;
  }
  const payload = `${hotelId}.${expiresAt}`;
  const expected = await sign(payload);
  if (!timingSafeEqual(signature, expected)) {
    return null;
  }
  if (Number(expiresAt) < Date.now()) {
    return null;
  }
  return hotelId;
}

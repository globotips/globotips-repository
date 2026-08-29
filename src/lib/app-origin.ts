import { headers } from "next/headers";
import { getStripeMode } from "@/lib/stripe-mode";
import { stripeRedirectOrigin } from "@/lib/stripe-origin";

export async function resolveAppOrigin(): Promise<string> {
  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";
  const proto =
    headerStore.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function resolveStripeRedirectOrigin(): Promise<string> {
  return stripeRedirectOrigin(getStripeMode(), await resolveAppOrigin());
}

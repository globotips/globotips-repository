import { LIVE_PUBLIC_ORIGIN } from "@/lib/config";
import type { StripeMode } from "@/lib/stripe-mode";

export function stripeRedirectOrigin(
  mode: StripeMode,
  requestOrigin: string,
): string {
  if (mode.kind === "live") {
    return LIVE_PUBLIC_ORIGIN;
  }
  return requestOrigin.replace(/\/$/, "");
}

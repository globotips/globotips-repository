import type { StripeMode } from "@/lib/stripe-mode";

export function DemoBanner({
  compact = false,
  stripeMode,
}: {
  compact?: boolean;
  stripeMode?: StripeMode;
}) {
  const className = `border-b border-gold/40 bg-gold/15 text-center text-ink ${
    compact ? "px-4 py-2 text-xs" : "px-4 py-2.5 text-sm"
  }`;

  if (stripeMode?.kind === "blocked") {
    return (
      <div className={`border-b border-danger/30 bg-danger/10 text-center text-danger ${compact ? "px-4 py-2 text-xs" : "px-4 py-2.5 text-sm"}`}>
        <strong className="font-semibold">Stripe blocked.</strong>{" "}
        {stripeMode.reason}
      </div>
    );
  }

  if (stripeMode?.kind === "live") {
    if (compact) {
      return null;
    }
    return (
      <div className="border-b border-teal/30 bg-teal/10 text-center text-teal-deep px-4 py-2.5 text-sm">
        <strong className="font-semibold">Stripe live mode.</strong> Real cards
        are charged. GloboTips keeps 3% from the tip. The hotel never holds
        money.
      </div>
    );
  }

  if (stripeMode?.kind === "test") {
    return (
      <div className={className}>
        <strong className="font-semibold">Stripe test mode.</strong> Use test
        cards and Express test onboarding. Live keys need STRIPE_MODE=live and
        NODE_ENV=production on the host.
      </div>
    );
  }

  return (
    <div className={className}>
      <strong className="font-semibold">Demo mode.</strong> Checkout is shown
      so you can try the flow. No real money is taken.
    </div>
  );
}

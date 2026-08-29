import { NextResponse } from "next/server";
import { getStripe, recordPaidCheckoutSession, syncEmployeeByStripeAccountId } from "@/lib/stripe";
import { getStripeMode } from "@/lib/stripe-mode";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const mode = getStripeMode();
  if (mode.kind !== "test") {
    return NextResponse.json(
      { error: "Stripe webhooks are only accepted in test mode." },
      { status: 503 },
    );
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not set." },
      { status: 500 },
    );
  }
  if (!secret.startsWith("whsec_")) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET must be a signing secret starting with whsec_." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature." }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripe();

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        await recordPaidCheckoutSession(session);
        break;
      }
      case "account.updated": {
        const account = event.data.object;
        await syncEmployeeByStripeAccountId(account.id);
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error("Stripe webhook handler failed", event.type, error);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

export type StripeMode =
  | { kind: "demo" }
  | { kind: "test" }
  | { kind: "blocked"; reason: string };

function firstNonEmpty(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) {
      return trimmed;
    }
  }
  return undefined;
}

export function inspectStripeSecretKey(
  secret = process.env.STRIPE_SECRET_KEY,
): StripeMode {
  const key = secret?.trim();
  if (!key) {
    return { kind: "demo" };
  }
  if (key.startsWith("sk_live_") || key.startsWith("rk_live_")) {
    return {
      kind: "blocked",
      reason:
        "A live Stripe secret key was set. This demo refuses live keys. Use sk_test_ only.",
    };
  }
  if (!key.startsWith("sk_test_")) {
    return {
      kind: "blocked",
      reason:
        "STRIPE_SECRET_KEY must be a Stripe test secret key starting with sk_test_.",
    };
  }
  return { kind: "test" };
}

export function inspectStripePublishableKeys(
  publishable = process.env.STRIPE_PUBLISHABLE_KEY,
  publicPublishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
): StripeMode {
  const key = firstNonEmpty(publishable, publicPublishable);
  if (!key) {
    return { kind: "demo" };
  }
  if (key.startsWith("pk_live_")) {
    return {
      kind: "blocked",
      reason:
        "A live Stripe publishable key was set. This demo refuses live keys. Use pk_test_ only.",
    };
  }
  if (!key.startsWith("pk_test_")) {
    return {
      kind: "blocked",
      reason:
        "Stripe publishable keys must be test keys starting with pk_test_.",
    };
  }
  return { kind: "test" };
}

export function getStripeMode(): StripeMode {
  const secret = inspectStripeSecretKey();
  if (secret.kind === "blocked") {
    return secret;
  }
  const publishable = inspectStripePublishableKeys();
  if (publishable.kind === "blocked") {
    return publishable;
  }
  return secret;
}

export function isStripeTestMode(): boolean {
  return getStripeMode().kind === "test";
}

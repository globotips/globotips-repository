export type StripeMode =
  | { kind: "demo" }
  | { kind: "test" }
  | { kind: "live" }
  | { kind: "blocked"; reason: string };

export type StripeEnvInput = {
  STRIPE_SECRET_KEY?: string;
  STRIPE_PUBLISHABLE_KEY?: string;
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
  STRIPE_MODE?: string;
  NODE_ENV?: string;
};

const LIVE_KEYS_REQUIREMENT =
  "Live Stripe keys are allowed only when STRIPE_MODE=live and NODE_ENV=production (host env). A local or test .env cannot charge real cards.";

function firstNonEmpty(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) {
      return trimmed;
    }
  }
  return undefined;
}

export function liveFlagsEnabled(
  stripeModeFlag = process.env.STRIPE_MODE,
  nodeEnv = process.env.NODE_ENV,
): boolean {
  return stripeModeFlag?.trim().toLowerCase() === "live" && nodeEnv === "production";
}

export function isStripeEnabled(mode: StripeMode): boolean {
  return mode.kind === "test" || mode.kind === "live";
}

export function inspectStripeSecretKey(
  secret = process.env.STRIPE_SECRET_KEY,
  stripeModeFlag = process.env.STRIPE_MODE,
  nodeEnv = process.env.NODE_ENV,
): StripeMode {
  const key = secret?.trim();
  if (!key) {
    return { kind: "demo" };
  }
  if (key.startsWith("sk_live_") || key.startsWith("rk_live_")) {
    if (!liveFlagsEnabled(stripeModeFlag, nodeEnv)) {
      return {
        kind: "blocked",
        reason: LIVE_KEYS_REQUIREMENT,
      };
    }
    return { kind: "live" };
  }
  if (key.startsWith("sk_test_")) {
    return { kind: "test" };
  }
  return {
    kind: "blocked",
    reason:
      "STRIPE_SECRET_KEY must be a Stripe secret key starting with sk_test_ or sk_live_.",
  };
}

export function inspectStripePublishableKeys(
  publishable = process.env.STRIPE_PUBLISHABLE_KEY,
  publicPublishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  stripeModeFlag = process.env.STRIPE_MODE,
  nodeEnv = process.env.NODE_ENV,
): StripeMode {
  const key = firstNonEmpty(publishable, publicPublishable);
  if (!key) {
    return { kind: "demo" };
  }
  if (key.startsWith("pk_live_")) {
    if (!liveFlagsEnabled(stripeModeFlag, nodeEnv)) {
      return {
        kind: "blocked",
        reason: LIVE_KEYS_REQUIREMENT,
      };
    }
    return { kind: "live" };
  }
  if (key.startsWith("pk_test_")) {
    return { kind: "test" };
  }
  return {
    kind: "blocked",
    reason:
      "Stripe publishable keys must start with pk_test_ or pk_live_.",
  };
}

export function resolveStripeMode(env: StripeEnvInput = process.env): StripeMode {
  const secret = inspectStripeSecretKey(
    env.STRIPE_SECRET_KEY,
    env.STRIPE_MODE,
    env.NODE_ENV,
  );
  if (secret.kind === "blocked") {
    return secret;
  }

  const publishable = inspectStripePublishableKeys(
    env.STRIPE_PUBLISHABLE_KEY,
    env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    env.STRIPE_MODE,
    env.NODE_ENV,
  );
  if (publishable.kind === "blocked") {
    return publishable;
  }

  if (secret.kind === "live" && publishable.kind === "test") {
    return {
      kind: "blocked",
      reason:
        "Live secret key cannot be paired with a test publishable key (pk_test_).",
    };
  }
  if (secret.kind === "test" && publishable.kind === "live") {
    return {
      kind: "blocked",
      reason:
        "Test secret key cannot be paired with a live publishable key (pk_live_).",
    };
  }

  if (liveFlagsEnabled(env.STRIPE_MODE, env.NODE_ENV) && secret.kind === "demo") {
    return {
      kind: "blocked",
      reason:
        "STRIPE_MODE=live requires STRIPE_SECRET_KEY (sk_live_) on the host. Do not put live keys in git.",
    };
  }

  return secret;
}

export function getStripeMode(): StripeMode {
  return resolveStripeMode(process.env);
}

export function isStripeTestMode(): boolean {
  return getStripeMode().kind === "test";
}

export function isStripeLiveMode(): boolean {
  return getStripeMode().kind === "live";
}

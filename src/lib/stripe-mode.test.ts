import assert from "node:assert/strict";
import { test } from "node:test";
import {
  inspectStripePublishableKeys,
  inspectStripeSecretKey,
  liveFlagsEnabled,
  resolveStripeMode,
} from "./stripe-mode";

test("unset secret key keeps demo fallback", () => {
  assert.deepEqual(inspectStripeSecretKey(undefined), { kind: "demo" });
  assert.deepEqual(inspectStripeSecretKey("  "), { kind: "demo" });
});

test("accepts test secret keys", () => {
  assert.deepEqual(inspectStripeSecretKey("sk_test_abc"), { kind: "test" });
});

test("refuses live secret keys without production live flags", () => {
  const live = inspectStripeSecretKey("sk_live_abc");
  assert.equal(live.kind, "blocked");
  if (live.kind === "blocked") {
    assert.match(live.reason, /STRIPE_MODE=live/);
    assert.match(live.reason, /NODE_ENV=production/);
  }
  assert.equal(inspectStripeSecretKey("sk_live_abc", "live", "development").kind, "blocked");
  assert.equal(inspectStripeSecretKey("sk_live_abc", "test", "production").kind, "blocked");
  assert.equal(inspectStripeSecretKey("rk_live_abc", undefined, "production").kind, "blocked");
});

test("accepts live secret keys only when STRIPE_MODE=live and NODE_ENV=production", () => {
  assert.deepEqual(inspectStripeSecretKey("sk_live_abc", "live", "production"), {
    kind: "live",
  });
  assert.deepEqual(inspectStripeSecretKey("rk_live_abc", "LIVE", "production"), {
    kind: "live",
  });
});

test("refuses live publishable keys without production live flags", () => {
  const live = inspectStripePublishableKeys("pk_live_abc", undefined);
  assert.equal(live.kind, "blocked");
  assert.equal(
    inspectStripePublishableKeys("pk_live_abc", undefined, "live", "test").kind,
    "blocked",
  );
});

test("accepts live publishable keys only with production live flags", () => {
  assert.deepEqual(
    inspectStripePublishableKeys("pk_live_abc", undefined, "live", "production"),
    { kind: "live" },
  );
});

test("accepts test publishable keys", () => {
  assert.deepEqual(inspectStripePublishableKeys("pk_test_abc", undefined), {
    kind: "test",
  });
});

test("live flags require both STRIPE_MODE=live and NODE_ENV=production", () => {
  assert.equal(liveFlagsEnabled("live", "production"), true);
  assert.equal(liveFlagsEnabled("LIVE", "production"), true);
  assert.equal(liveFlagsEnabled("live", "development"), false);
  assert.equal(liveFlagsEnabled(undefined, "production"), false);
});

test("resolveStripeMode blocks mixed live/test keys", () => {
  const mixedLiveSecret = resolveStripeMode({
    STRIPE_SECRET_KEY: "sk_live_abc",
    STRIPE_PUBLISHABLE_KEY: "pk_test_abc",
    STRIPE_MODE: "live",
    NODE_ENV: "production",
  });
  assert.equal(mixedLiveSecret.kind, "blocked");

  const mixedTestSecret = resolveStripeMode({
    STRIPE_SECRET_KEY: "sk_test_abc",
    STRIPE_PUBLISHABLE_KEY: "pk_live_abc",
    STRIPE_MODE: "live",
    NODE_ENV: "production",
  });
  assert.equal(mixedTestSecret.kind, "blocked");
});

test("resolveStripeMode is live when host flags and live keys match", () => {
  assert.deepEqual(
    resolveStripeMode({
      STRIPE_SECRET_KEY: "sk_live_abc",
      STRIPE_PUBLISHABLE_KEY: "pk_live_abc",
      STRIPE_MODE: "live",
      NODE_ENV: "production",
    }),
    { kind: "live" },
  );
});

test("STRIPE_MODE=live without a secret key is blocked", () => {
  const missing = resolveStripeMode({
    STRIPE_MODE: "live",
    NODE_ENV: "production",
  });
  assert.equal(missing.kind, "blocked");
  if (missing.kind === "blocked") {
    assert.match(missing.reason, /sk_live_/);
  }
});

test("test keys still work when live flags are set", () => {
  assert.deepEqual(
    resolveStripeMode({
      STRIPE_SECRET_KEY: "sk_test_abc",
      STRIPE_MODE: "live",
      NODE_ENV: "production",
    }),
    { kind: "test" },
  );
});

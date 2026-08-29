import assert from "node:assert/strict";
import { test } from "node:test";
import {
  inspectStripePublishableKeys,
  inspectStripeSecretKey,
} from "./stripe-mode";

test("unset secret key keeps demo fallback", () => {
  assert.deepEqual(inspectStripeSecretKey(undefined), { kind: "demo" });
  assert.deepEqual(inspectStripeSecretKey("  "), { kind: "demo" });
});

test("accepts test secret keys", () => {
  assert.deepEqual(inspectStripeSecretKey("sk_test_abc"), { kind: "test" });
});

test("refuses live secret keys", () => {
  const live = inspectStripeSecretKey("sk_live_abc");
  assert.equal(live.kind, "blocked");
  if (live.kind === "blocked") {
    assert.match(live.reason, /live/i);
  }
});

test("refuses live publishable keys", () => {
  const live = inspectStripePublishableKeys("pk_live_abc", undefined);
  assert.equal(live.kind, "blocked");
});

test("accepts test publishable keys", () => {
  assert.deepEqual(inspectStripePublishableKeys("pk_test_abc", undefined), {
    kind: "test",
  });
});

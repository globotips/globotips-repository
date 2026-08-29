import assert from "node:assert/strict";
import { test } from "node:test";
import { LIVE_PUBLIC_ORIGIN } from "./config";
import { stripeRedirectOrigin } from "./stripe-origin";

test("live mode Account Link and Checkout URLs use www.globotips.com", () => {
  assert.equal(
    stripeRedirectOrigin({ kind: "live" }, "http://localhost:3000"),
    "https://www.globotips.com",
  );
  assert.equal(
    stripeRedirectOrigin({ kind: "live" }, "https://preview.example.com"),
    LIVE_PUBLIC_ORIGIN,
  );
  assert.equal(LIVE_PUBLIC_ORIGIN, "https://www.globotips.com");
});

test("test and demo modes keep the request origin", () => {
  assert.equal(
    stripeRedirectOrigin({ kind: "test" }, "http://localhost:3000"),
    "http://localhost:3000",
  );
  assert.equal(
    stripeRedirectOrigin({ kind: "demo" }, "https://preview.example.com/"),
    "https://preview.example.com",
  );
});

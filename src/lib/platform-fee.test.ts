import assert from "node:assert/strict";
import { test } from "node:test";
import { MIN_TIP_CENTS, platformFeeCents } from "./platform-fee";

test("3% fee on presets, guest is not surcharged", () => {
  assert.equal(platformFeeCents(500), 15);
  assert.equal(platformFeeCents(1000), 30);
  assert.equal(platformFeeCents(2000), 60);
});

test("rounds half up to the nearest cent", () => {
  assert.equal(platformFeeCents(150), 5);
  assert.equal(platformFeeCents(MIN_TIP_CENTS), 3);
});

test("rejects amounts below $1", () => {
  assert.throws(() => platformFeeCents(99), /at least \$1/);
  assert.throws(() => platformFeeCents(10.5), /whole-cent/);
});

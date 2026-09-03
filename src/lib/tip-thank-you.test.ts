import assert from "node:assert/strict";
import { test } from "node:test";
import {
  tipThankYouCopy,
  tipThankYouCopyMentionsBrand,
} from "./tip-thank-you";

test("thank-you copy names the employee and stays free of GloboTips", () => {
  const live = tipThankYouCopy({
    name: "Maria Santos",
    payMode: "stripe",
    stripeKind: "live",
  });
  const testMode = tipThankYouCopy({
    name: "James Okonkwo",
    payMode: "stripe",
    stripeKind: "test",
  });
  const demo = tipThankYouCopy({
    name: "Elena Rossi",
    payMode: "demo",
    stripeKind: "test",
  });

  assert.equal(live.heading, "Thank you");
  assert.equal(live.confirmation, "Maria Santos received your tip.");
  assert.equal(live.signoff, "Travel Gratuity Group");
  assert.equal(testMode.confirmation, "James Okonkwo received your tip.");
  assert.equal(demo.confirmation, "Elena Rossi received your tip.");
  assert.match(demo.detail, /practice tip/i);
  assert.match(testMode.detail, /test-mode/i);

  for (const copy of [live, testMode, demo]) {
    const blob = Object.values(copy).join(" ");
    assert.equal(tipThankYouCopyMentionsBrand(blob), false);
  }
});

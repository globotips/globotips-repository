import assert from "node:assert/strict";
import { test } from "node:test";
import { sendInviteSms, staffInviteSmsBody, twilioConfigured } from "./sms";

test("twilioConfigured requires all three env vars", () => {
  assert.equal(twilioConfigured({}), false);
  assert.equal(
    twilioConfigured({
      TWILIO_ACCOUNT_SID: "ACxxx",
      TWILIO_AUTH_TOKEN: "secret",
    }),
    false,
  );
  assert.equal(
    twilioConfigured({
      TWILIO_ACCOUNT_SID: "ACxxx",
      TWILIO_AUTH_TOKEN: "secret",
      TWILIO_FROM_NUMBER: "+18135550100",
    }),
    true,
  );
});

test("staff invite SMS names Travel Gratuity Group and the join URL", () => {
  const body = staffInviteSmsBody(
    "The Harbor Hotel, Tampa",
    "https://www.travelgratuitygroup.com/join/abc",
  );
  assert.match(body, /Travel Gratuity Group/);
  assert.match(body, /The Harbor Hotel, Tampa/);
  assert.match(body, /travelgratuitygroup.com\/join\/abc/);
  assert.doesNotMatch(body, /GloboTips/i);
});

test("sendInviteSms skips when Twilio is not configured", async () => {
  assert.equal(
    await sendInviteSms("+18135550101", "hello", {}),
    "skipped",
  );
});

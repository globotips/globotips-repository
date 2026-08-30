import assert from "node:assert/strict";
import { test } from "node:test";
import {
  expressAccountConfiguration,
  expressOnboardingConfigurations,
} from "./stripe-connect-account";

test("v2 account create requests merchant card_payments with recipient stripe_transfers", () => {
  const configuration = expressAccountConfiguration();
  assert.equal(configuration.merchant.capabilities.card_payments.requested, true);
  assert.equal(
    configuration.recipient.capabilities.stripe_balance.stripe_transfers.requested,
    true,
  );
});

test("Account Links onboard merchant and recipient configurations", () => {
  assert.deepEqual([...expressOnboardingConfigurations], ["merchant", "recipient"]);
});

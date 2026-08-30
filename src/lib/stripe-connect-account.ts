/**
 * Accounts v2 payload for Express-style staff accounts.
 *
 * Live Stripe returns capability_not_available_without_other_capability if
 * recipient stripe_transfers is requested without merchant card_payments.
 * Destination charges still use application_fee_amount + transfer_data.destination
 * on the platform Checkout Session.
 */
export function expressAccountConfiguration() {
  return {
    merchant: {
      capabilities: {
        card_payments: { requested: true },
      },
    },
    recipient: {
      capabilities: {
        stripe_balance: {
          stripe_transfers: { requested: true },
        },
      },
    },
  };
}

/** Account Links must collect requirements for the same configurations requested on create. */
export const expressOnboardingConfigurations = ["merchant", "recipient"] as const;

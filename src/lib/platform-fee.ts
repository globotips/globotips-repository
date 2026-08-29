/** GloboTips keeps 3% of the tip. The guest is not surcharged. */
export const PLATFORM_FEE_PERCENT = 3;
export const MIN_TIP_CENTS = 100;

export function platformFeeCents(amountCents: number): number {
  if (!Number.isInteger(amountCents) || amountCents < MIN_TIP_CENTS) {
    throw new Error("Tip must be a whole-cent amount of at least $1.");
  }
  return Math.round((amountCents * PLATFORM_FEE_PERCENT) / 100);
}

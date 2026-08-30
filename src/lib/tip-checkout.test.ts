import assert from "node:assert/strict";
import { test } from "node:test";
import {
  parseTipCheckoutAmount,
  parseTipCheckoutPayError,
  resolveTipCheckoutRedirect,
  tipCheckoutErrorRedirectUrl,
  TIP_CHECKOUT_PAY_ERRORS,
} from "./tip-checkout";

test("parseTipCheckoutAmount accepts whole-cent tips of at least $1", () => {
  assert.equal(parseTipCheckoutAmount("500"), 500);
  assert.equal(parseTipCheckoutAmount("1000"), 1000);
  assert.equal(parseTipCheckoutAmount("2000"), 2000);
  assert.equal(parseTipCheckoutAmount(" 150 "), 150);
});

test("parseTipCheckoutAmount rejects missing or sub-dollar amounts", () => {
  assert.equal(parseTipCheckoutAmount(null), null);
  assert.equal(parseTipCheckoutAmount(""), null);
  assert.equal(parseTipCheckoutAmount("99"), null);
  assert.equal(parseTipCheckoutAmount("10.5"), null);
  assert.equal(parseTipCheckoutAmount("abc"), null);
});

test("parseTipCheckoutPayError maps known codes and falls back for junk", () => {
  assert.equal(parseTipCheckoutPayError(undefined), null);
  assert.equal(parseTipCheckoutPayError(""), null);
  assert.equal(parseTipCheckoutPayError("amount"), TIP_CHECKOUT_PAY_ERRORS.amount);
  assert.equal(parseTipCheckoutPayError("stripe"), TIP_CHECKOUT_PAY_ERRORS.stripe);
  assert.equal(parseTipCheckoutPayError("not_ready"), TIP_CHECKOUT_PAY_ERRORS.not_ready);
  assert.equal(parseTipCheckoutPayError("nope"), TIP_CHECKOUT_PAY_ERRORS.stripe);
});

test("successful checkout uses a 303 to the Stripe session URL", () => {
  const redirect = resolveTipCheckoutRedirect(
    { ok: true, url: "https://checkout.stripe.com/c/pay/cs_live_test" },
    "https://www.globotips.com",
    "dariusz-dudkiewicz",
  );
  assert.equal(redirect.status, 303);
  assert.equal(redirect.url, "https://checkout.stripe.com/c/pay/cs_live_test");
});

test("failed checkout 303s back to the tip page with a pay_error code", () => {
  const redirect = resolveTipCheckoutRedirect(
    { ok: false, code: "stripe", error: TIP_CHECKOUT_PAY_ERRORS.stripe },
    "https://www.globotips.com",
    "dariusz-dudkiewicz",
  );
  assert.equal(redirect.status, 303);
  assert.equal(
    redirect.url,
    "https://www.globotips.com/tip/dariusz-dudkiewicz?pay_error=stripe",
  );
  assert.equal(
    tipCheckoutErrorRedirectUrl("https://www.globotips.com/", "", "amount"),
    "https://www.globotips.com/?pay_error=amount",
  );
});

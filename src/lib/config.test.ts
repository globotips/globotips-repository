import assert from "node:assert/strict";
import { test } from "node:test";
import { GUEST_BRAND_NAME, LEGAL_ENTITY, LEGAL_FOOTER } from "./brand";
import {
  LIVE_PUBLIC_ORIGIN,
  PUBLIC_TIP_HOST,
  SESSION_COOKIE,
  displayJoinLink,
  displayTipLink,
} from "./config";

test("guest-facing host is travelgratuitygroup.com", () => {
  assert.equal(PUBLIC_TIP_HOST, "travelgratuitygroup.com");
  assert.equal(displayTipLink("maria-santos"), "travelgratuitygroup.com/tip/maria-santos");
  assert.equal(displayJoinLink("tok"), "travelgratuitygroup.com/join/tok");
});

test("legal entity and session cookie stay GLOBOTIPS / globotips", () => {
  assert.equal(LEGAL_ENTITY, "GLOBOTIPS LLC");
  assert.equal(GUEST_BRAND_NAME, "Travel Gratuity Group");
  assert.equal(LEGAL_FOOTER, "Payments by GLOBOTIPS LLC · Travel Gratuity Group");
  assert.equal(SESSION_COOKIE, "globotips_session");
  assert.equal(LIVE_PUBLIC_ORIGIN, "https://www.globotips.com");
});

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DEFAULT_INTEREST_COUNTRY,
  parseInterestForm,
} from "./interest-lead";
import {
  isInterestRateLimited,
  resetInterestRateLimitForTests,
} from "./interest-rate-limit";

const valid = {
  fullName: "Ana Souza",
  email: "ana@hotel.com",
  phone: "+55 11 99999-1234",
  country: "",
  city: "São Paulo",
  role: "hotel",
  businessName: "Hotel Copacabana",
  notes: "Zona sul",
  website: "",
  locale: "pt",
};

test("parses a valid Brazil interest lead and defaults country", () => {
  const result = parseInterestForm(valid);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.country, DEFAULT_INTEREST_COUNTRY);
    assert.equal(result.data.email, "ana@hotel.com");
    assert.equal(result.data.role, "hotel");
    assert.equal(result.data.notes, "Zona sul");
    assert.equal(result.data.locale, "pt");
  }
});

test("rejects missing name, bad email, and unknown role", () => {
  assert.equal(parseInterestForm({ ...valid, fullName: "A" }).ok, false);
  assert.equal(parseInterestForm({ ...valid, email: "not-an-email" }).ok, false);
  assert.equal(parseInterestForm({ ...valid, role: "stripe" }).ok, false);
  assert.equal(parseInterestForm({ ...valid, phone: "123" }).ok, false);
});

test("treats a filled honeypot as spam without saving", () => {
  const result = parseInterestForm({ ...valid, website: "https://spam.test" });
  assert.deepEqual(result, { ok: false, reason: "spam", messageKey: "fullName" });
});

test("rate limit trips after repeated keys in the window", () => {
  resetInterestRateLimitForTests();
  const key = "ana@hotel.com";
  assert.equal(isInterestRateLimited(key), false);
  assert.equal(isInterestRateLimited(key), false);
  assert.equal(isInterestRateLimited(key), false);
  assert.equal(isInterestRateLimited(key), false);
  assert.equal(isInterestRateLimited(key), false);
  assert.equal(isInterestRateLimited(key), true);
});

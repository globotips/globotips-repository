import assert from "node:assert/strict";
import { test } from "node:test";
import { formatUsMobile, parseUsMobile } from "./phone";

test("parseUsMobile accepts common US writings and stores E.164", () => {
  assert.equal(parseUsMobile("(813) 555-0101"), "+18135550101");
  assert.equal(parseUsMobile("813-555-0101"), "+18135550101");
  assert.equal(parseUsMobile("8135550101"), "+18135550101");
  assert.equal(parseUsMobile("+1 813 555 0101"), "+18135550101");
  assert.equal(parseUsMobile("1 (813) 555-0101"), "+18135550101");
});

test("parseUsMobile rejects empty, short, and non-US numbers", () => {
  assert.equal(parseUsMobile(""), null);
  assert.equal(parseUsMobile("555-0101"), null);
  assert.equal(parseUsMobile("+44 20 7946 0018"), null);
  assert.equal(parseUsMobile("0135550101"), null);
  assert.equal(parseUsMobile("8130550101"), null);
});

test("formatUsMobile pretty-prints E.164", () => {
  assert.equal(formatUsMobile("+18135550101"), "(813) 555-0101");
});

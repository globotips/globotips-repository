import assert from "node:assert/strict";
import { test } from "node:test";
import { hotelAdminOnboardingUrls, staffJoinOnboardingUrls } from "./onboarding-urls";

test("staff Account Link returns to the public join page", () => {
  assert.deepEqual(staffJoinOnboardingUrls("https://www.globotips.com/", "tok_abc"), {
    returnUrl: "https://www.globotips.com/join/tok_abc?stripe=return",
    refreshUrl: "https://www.globotips.com/join/tok_abc/refresh",
  });
});

test("hotel admin Account Link still returns to /admin/connect", () => {
  assert.deepEqual(hotelAdminOnboardingUrls("http://localhost:3000", "emp_1"), {
    returnUrl: "http://localhost:3000/admin/connect/return?employee=emp_1",
    refreshUrl: "http://localhost:3000/admin/connect/refresh?employee=emp_1",
  });
});

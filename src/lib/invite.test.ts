import assert from "node:assert/strict";
import { test } from "node:test";
import {
  INVITE_STATUS,
  INVITE_STATUS_LABEL,
  canDownloadTipQr,
  canShowJoinQr,
  connectInviteStatus,
  createInviteToken,
  remindAtFromNow,
  resolveInviteStatus,
} from "./invite";

test("resolveInviteStatus prefers payouts-ready Active", () => {
  assert.equal(
    resolveInviteStatus({ inviteStatus: "invited", payoutsEnabled: true }),
    INVITE_STATUS.active,
  );
  assert.equal(
    resolveInviteStatus({ inviteStatus: "declined", payoutsEnabled: false }),
    INVITE_STATUS.declined,
  );
  assert.equal(
    resolveInviteStatus({ inviteStatus: "pending", payoutsEnabled: false }),
    INVITE_STATUS.pending,
  );
  assert.equal(
    resolveInviteStatus({ inviteStatus: "invited", payoutsEnabled: false }),
    INVITE_STATUS.invited,
  );
});

test("status labels match the hotel pilot copy", () => {
  assert.equal(INVITE_STATUS_LABEL.invited, "Invited");
  assert.equal(INVITE_STATUS_LABEL.pending, "Pending");
  assert.equal(INVITE_STATUS_LABEL.active, "Active");
  assert.equal(INVITE_STATUS_LABEL.declined, "Declined");
});

test("tip QR is for Active staff; join QR is for Invited and Pending", () => {
  assert.equal(canDownloadTipQr("active"), true);
  assert.equal(canDownloadTipQr("invited"), false);
  assert.equal(canShowJoinQr("invited"), true);
  assert.equal(canShowJoinQr("pending"), true);
  assert.equal(canShowJoinQr("active"), false);
  assert.equal(canShowJoinQr("declined"), false);
});

test("connectInviteStatus becomes Active when payouts are ready", () => {
  assert.equal(connectInviteStatus(true, "invited"), "active");
  assert.equal(connectInviteStatus(false, "active"), "invited");
  assert.equal(connectInviteStatus(false, "pending"), "pending");
  assert.equal(connectInviteStatus(false, "declined"), "declined");
});

test("remindAtFromNow is seven days later", () => {
  const now = new Date("2026-09-05T12:00:00.000Z");
  assert.equal(remindAtFromNow(now).toISOString(), "2026-09-12T12:00:00.000Z");
});

test("createInviteToken is unguessable", () => {
  const token = createInviteToken();
  assert.ok(token.length >= 24);
  assert.notEqual(createInviteToken(), token);
});

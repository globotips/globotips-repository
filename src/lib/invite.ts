import { randomBytes } from "crypto";

export const INVITE_STATUS = {
  invited: "invited",
  pending: "pending",
  active: "active",
  declined: "declined",
} as const;

export type InviteStatus = (typeof INVITE_STATUS)[keyof typeof INVITE_STATUS];

export const INVITE_STATUS_LABEL: Record<InviteStatus, string> = {
  invited: "Invited",
  pending: "Pending",
  active: "Active",
  declined: "Declined",
};

export function createInviteToken(): string {
  return randomBytes(24).toString("base64url");
}

export function resolveInviteStatus(employee: {
  inviteStatus: string;
  payoutsEnabled: boolean;
}): InviteStatus {
  if (employee.payoutsEnabled) {
    return INVITE_STATUS.active;
  }
  if (employee.inviteStatus === INVITE_STATUS.declined) {
    return INVITE_STATUS.declined;
  }
  if (employee.inviteStatus === INVITE_STATUS.pending) {
    return INVITE_STATUS.pending;
  }
  return INVITE_STATUS.invited;
}

export function remindAtFromNow(now = new Date()): Date {
  return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
}

export function canDownloadTipQr(status: InviteStatus): boolean {
  return status === INVITE_STATUS.active;
}

export function canShowJoinQr(status: InviteStatus): boolean {
  return status === INVITE_STATUS.invited || status === INVITE_STATUS.pending;
}

export function connectInviteStatus(payoutsEnabled: boolean, current: string): string {
  if (payoutsEnabled) {
    return INVITE_STATUS.active;
  }
  if (current === INVITE_STATUS.active) {
    return INVITE_STATUS.invited;
  }
  return current;
}

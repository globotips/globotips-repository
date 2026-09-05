import type { Employee } from "@prisma/client";
import { displayJoinLink, qrJoinUrl } from "@/lib/config";
import { prisma } from "@/lib/db";
import { INVITE_STATUS, createInviteToken } from "@/lib/invite";
import { sendInviteSms, staffInviteSmsBody, type SmsSendResult } from "@/lib/sms";
import { createAccountOnboardingLink, createExpressAccount } from "@/lib/stripe";
import { getStripeMode, isStripeEnabled } from "@/lib/stripe-mode";

export async function markInvitedAndNotify(employee: Employee): Promise<{
  sms: SmsSendResult;
  token: string;
  joinDisplayUrl: string;
}> {
  const token = employee.inviteToken ?? createInviteToken();
  let stripeAccountId = employee.stripeAccountId;

  if (isStripeEnabled(getStripeMode()) && !stripeAccountId) {
    try {
      stripeAccountId = await createExpressAccount({
        ...employee,
        inviteToken: token,
      });
    } catch {
      stripeAccountId = employee.stripeAccountId;
    }
  }

  const nextStatus = employee.payoutsEnabled
    ? INVITE_STATUS.active
    : INVITE_STATUS.invited;

  await prisma.employee.update({
    where: { id: employee.id },
    data: {
      inviteToken: token,
      stripeAccountId,
      inviteStatus: nextStatus,
      declinedAt: nextStatus === INVITE_STATUS.invited ? null : undefined,
      remindAt: nextStatus === INVITE_STATUS.invited ? null : undefined,
      lastInvitedAt: new Date(),
    },
  });

  let sms: SmsSendResult = "skipped";
  if (employee.phone) {
    const hotel = await prisma.hotel.findUnique({
      where: { id: employee.hotelId },
    });
    sms = await sendInviteSms(
      employee.phone,
      staffInviteSmsBody(hotel?.name ?? "Your hotel", qrJoinUrl(token)),
    );
  }

  return {
    sms,
    token,
    joinDisplayUrl: displayJoinLink(token),
  };
}

export async function startStaffOnboardingRedirect(
  employee: Employee,
  origin: string,
): Promise<string> {
  const token = employee.inviteToken ?? createInviteToken();
  let current = employee;
  if (!employee.inviteToken) {
    current = await prisma.employee.update({
      where: { id: employee.id },
      data: { inviteToken: token },
    });
  }

  let stripeAccountId = current.stripeAccountId;
  if (!stripeAccountId) {
    stripeAccountId = await createExpressAccount(current);
    current = await prisma.employee.update({
      where: { id: current.id },
      data: { stripeAccountId },
    });
  }

  return createAccountOnboardingLink(stripeAccountId, origin, current.id, token);
}

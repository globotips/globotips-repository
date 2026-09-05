"use server";

import { redirect } from "next/navigation";
import { resolveStripeRedirectOrigin } from "@/lib/app-origin";
import { prisma } from "@/lib/db";
import { INVITE_STATUS, remindAtFromNow } from "@/lib/invite";
import { startStaffOnboardingRedirect } from "@/lib/staff-invite";
import { getStripeMode, isStripeEnabled } from "@/lib/stripe-mode";

async function employeeByToken(token: string) {
  if (!token) {
    return null;
  }
  return prisma.employee.findUnique({
    where: { inviteToken: token },
  });
}

export async function joinNowAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const employee = await employeeByToken(token);
  if (!employee) {
    redirect("/join/not-found");
  }

  if (employee.inviteStatus === INVITE_STATUS.declined) {
    await prisma.employee.update({
      where: { id: employee.id },
      data: {
        inviteStatus: INVITE_STATUS.invited,
        declinedAt: null,
      },
    });
  }

  if (!isStripeEnabled(getStripeMode())) {
    redirect(`/join/${encodeURIComponent(token)}?stripe=unavailable`);
  }

  let onboardingUrl: string;
  try {
    onboardingUrl = await startStaffOnboardingRedirect(
      { ...employee, inviteStatus: INVITE_STATUS.invited, declinedAt: null },
      await resolveStripeRedirectOrigin(),
    );
  } catch {
    redirect(`/join/${encodeURIComponent(token)}?stripe=error`);
  }
  redirect(onboardingUrl);
}

export async function remindLaterAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const employee = await employeeByToken(token);
  if (!employee) {
    redirect("/join/not-found");
  }
  if (employee.payoutsEnabled) {
    redirect(`/join/${encodeURIComponent(token)}`);
  }
  await prisma.employee.update({
    where: { id: employee.id },
    data: {
      inviteStatus: INVITE_STATUS.pending,
      remindAt: remindAtFromNow(),
      declinedAt: null,
    },
  });
  redirect(`/join/${encodeURIComponent(token)}?choice=pending`);
}

export async function declineInviteAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const employee = await employeeByToken(token);
  if (!employee) {
    redirect("/join/not-found");
  }
  if (employee.payoutsEnabled) {
    redirect(`/join/${encodeURIComponent(token)}`);
  }
  await prisma.employee.update({
    where: { id: employee.id },
    data: {
      inviteStatus: INVITE_STATUS.declined,
      declinedAt: new Date(),
      remindAt: null,
    },
  });
  redirect(`/join/${encodeURIComponent(token)}?choice=declined`);
}

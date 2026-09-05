import { redirect } from "next/navigation";
import { resolveStripeRedirectOrigin } from "@/lib/app-origin";
import { prisma } from "@/lib/db";
import { startStaffOnboardingRedirect } from "@/lib/staff-invite";
import { getStripeMode, isStripeEnabled } from "@/lib/stripe-mode";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  const employee = await prisma.employee.findUnique({
    where: { inviteToken: token },
  });
  if (!employee) {
    redirect("/join/not-found");
  }
  if (!isStripeEnabled(getStripeMode())) {
    redirect(`/join/${encodeURIComponent(token)}?stripe=unavailable`);
  }

  let url: string;
  try {
    url = await startStaffOnboardingRedirect(
      employee,
      await resolveStripeRedirectOrigin(),
    );
  } catch {
    redirect(`/join/${encodeURIComponent(token)}?stripe=error`);
  }
  redirect(url);
}

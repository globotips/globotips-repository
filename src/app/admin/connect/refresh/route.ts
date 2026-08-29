import { redirect } from "next/navigation";
import { getSessionHotel } from "@/lib/auth";
import { resolveAppOrigin } from "@/lib/app-origin";
import { prisma } from "@/lib/db";
import { createAccountOnboardingLink } from "@/lib/stripe";
import { getStripeMode } from "@/lib/stripe-mode";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const hotel = await getSessionHotel();
  if (!hotel) {
    redirect("/login");
  }

  if (getStripeMode().kind !== "test") {
    redirect("/admin?connect=error");
  }

  const employeeId = new URL(request.url).searchParams.get("employee");
  if (!employeeId) {
    redirect("/admin");
  }

  const employee = await prisma.employee.findFirst({
    where: { id: employeeId, hotelId: hotel.id },
  });
  if (!employee?.stripeAccountId) {
    redirect("/admin?connect=error");
  }

  let url: string;
  try {
    const origin = await resolveAppOrigin();
    url = await createAccountOnboardingLink(
      employee.stripeAccountId,
      origin,
      employee.id,
    );
  } catch {
    redirect("/admin?connect=error");
  }
  redirect(url);
}

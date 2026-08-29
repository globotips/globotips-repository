import { redirect } from "next/navigation";
import { getSessionHotel } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStripeMode } from "@/lib/stripe-mode";
import { syncEmployeeConnectStatus } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function ConnectReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ employee?: string }>;
}) {
  const hotel = await getSessionHotel();
  if (!hotel) {
    redirect("/login");
  }

  const mode = getStripeMode();
  if (mode.kind !== "test") {
    redirect("/admin?connect=error");
  }

  const { employee: employeeId } = await searchParams;
  if (!employeeId) {
    redirect("/admin");
  }

  const employee = await prisma.employee.findFirst({
    where: { id: employeeId, hotelId: hotel.id },
  });
  if (!employee?.stripeAccountId) {
    redirect("/admin?connect=error");
  }

  let updated;
  try {
    updated = await syncEmployeeConnectStatus(employee);
  } catch {
    redirect("/admin?connect=error");
  }
  redirect(updated.payoutsEnabled ? "/admin?connect=live" : "/admin?connect=pending");
}

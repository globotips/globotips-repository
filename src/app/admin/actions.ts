"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { resolveAppOrigin } from "@/lib/app-origin";
import { getSessionHotel, sessionCookieOptions, verifyHotelLogin } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/config";
import { prisma } from "@/lib/db";
import { createSessionToken } from "@/lib/session";
import {
  createAccountOnboardingLink,
  createExpressAccount,
} from "@/lib/stripe";
import { getStripeMode } from "@/lib/stripe-mode";
import { createUniqueTipCode } from "@/lib/tip-code";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const hotel = await verifyHotelLogin(email, password);
  if (!hotel) {
    redirect("/login?error=1");
  }
  const store = await cookies();
  store.set(SESSION_COOKIE, await createSessionToken(hotel.id), sessionCookieOptions());
  redirect("/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}

async function startOnboardingRedirect(employeeId: string, hotelId: string) {
  const employee = await prisma.employee.findFirst({
    where: { id: employeeId, hotelId },
  });
  if (!employee) {
    redirect("/admin?connect=error");
  }

  let onboardingUrl: string;
  try {
    let stripeAccountId = employee.stripeAccountId;
    if (!stripeAccountId) {
      stripeAccountId = await createExpressAccount(employee);
      await prisma.employee.update({
        where: { id: employee.id },
        data: { stripeAccountId },
      });
    }
    onboardingUrl = await createAccountOnboardingLink(
      stripeAccountId,
      await resolveAppOrigin(),
      employee.id,
    );
  } catch {
    redirect("/admin?connect=error");
  }
  redirect(onboardingUrl);
}

export async function addEmployeeAction(formData: FormData) {
  const hotel = await getSessionHotel();
  if (!hotel) {
    redirect("/login");
  }
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    redirect("/admin?staffError=name");
  }
  const tipCode = await createUniqueTipCode(name);
  const employee = await prisma.employee.create({
    data: {
      hotelId: hotel.id,
      name,
      tipCode,
    },
  });
  revalidatePath("/admin");

  if (getStripeMode().kind === "test") {
    await startOnboardingRedirect(employee.id, hotel.id);
  }
}

export async function startEmployeeOnboardingAction(formData: FormData) {
  const hotel = await getSessionHotel();
  if (!hotel) {
    redirect("/login");
  }
  if (getStripeMode().kind !== "test") {
    redirect("/admin?connect=error");
  }
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin");
  }
  await startOnboardingRedirect(id, hotel.id);
}

export async function removeEmployeeAction(formData: FormData) {
  const hotel = await getSessionHotel();
  if (!hotel) {
    redirect("/login");
  }
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }
  await prisma.employee.deleteMany({
    where: { id, hotelId: hotel.id },
  });
  revalidatePath("/admin");
}

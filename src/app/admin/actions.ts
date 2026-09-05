"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionHotel, sessionCookieOptions, verifyHotelLogin } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/config";
import { prisma } from "@/lib/db";
import { parseUsMobile } from "@/lib/phone";
import { createSessionToken } from "@/lib/session";
import { markInvitedAndNotify } from "@/lib/staff-invite";
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

export async function addEmployeeAction(formData: FormData) {
  const hotel = await getSessionHotel();
  if (!hotel) {
    redirect("/login");
  }
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    redirect("/admin?staffError=name");
  }
  const phone = parseUsMobile(String(formData.get("phone") ?? ""));
  if (!phone) {
    redirect("/admin?staffError=phone");
  }
  const tipCode = await createUniqueTipCode(name);
  const employee = await prisma.employee.create({
    data: {
      hotelId: hotel.id,
      name,
      phone,
      tipCode,
      inviteStatus: "invited",
    },
  });

  const { sms } = await markInvitedAndNotify(employee);
  revalidatePath("/admin");
  redirect(`/admin?invited=${encodeURIComponent(employee.id)}&sms=${sms}`);
}

export async function updateEmployeeAction(formData: FormData) {
  const hotel = await getSessionHotel();
  if (!hotel) {
    redirect("/login");
  }
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) {
    redirect("/admin?staffError=name");
  }
  const phone = parseUsMobile(String(formData.get("phone") ?? ""));
  if (!phone) {
    redirect("/admin?staffError=phone");
  }
  const employee = await prisma.employee.findFirst({
    where: { id, hotelId: hotel.id },
  });
  if (!employee) {
    redirect("/admin");
  }
  await prisma.employee.update({
    where: { id: employee.id },
    data: { name, phone },
  });
  revalidatePath("/admin");
}

export async function resendInviteAction(formData: FormData) {
  const hotel = await getSessionHotel();
  if (!hotel) {
    redirect("/login");
  }
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin");
  }
  const employee = await prisma.employee.findFirst({
    where: { id, hotelId: hotel.id },
  });
  if (!employee) {
    redirect("/admin");
  }
  if (!employee.phone) {
    redirect(`/admin?staffError=phone&edit=${encodeURIComponent(employee.id)}`);
  }
  const { sms } = await markInvitedAndNotify(employee);
  revalidatePath("/admin");
  redirect(`/admin?invited=${encodeURIComponent(employee.id)}&sms=${sms}`);
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

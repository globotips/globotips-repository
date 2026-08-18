"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/config";
import { getSessionHotel, sessionCookieOptions, verifyHotelLogin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createSessionToken } from "@/lib/session";
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
  const tipCode = await createUniqueTipCode(name);
  await prisma.employee.create({
    data: {
      hotelId: hotel.id,
      name,
      tipCode,
    },
  });
  revalidatePath("/admin");
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

export async function recordDemoTipAction(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim();
  const amountRaw = String(formData.get("amountCents") ?? "");
  const amountCents = Number.parseInt(amountRaw, 10);
  if (!code || !Number.isInteger(amountCents) || amountCents < 100) {
    return { ok: false as const, error: "Choose a tip of at least $1." };
  }
  const employee = await prisma.employee.findUnique({
    where: { tipCode: code },
  });
  if (!employee) {
    return { ok: false as const, error: "This tip page is not available." };
  }
  await prisma.tip.create({
    data: {
      employeeId: employee.id,
      amountCents,
    },
  });
  return { ok: true as const, amountCents };
}

import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/config";
import { readSessionHotelId } from "@/lib/session";

export async function verifyHotelLogin(email: string, password: string) {
  const hotel = await prisma.hotel.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  if (!hotel) {
    return null;
  }
  const matches = await compare(password, hotel.passwordHash);
  return matches ? hotel : null;
}

export async function getSessionHotel() {
  const store = await cookies();
  const hotelId = await readSessionHotelId(store.get(SESSION_COOKIE)?.value);
  if (!hotelId) {
    return null;
  }
  return prisma.hotel.findUnique({ where: { id: hotelId } });
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  };
}

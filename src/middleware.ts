import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/config";
import { readSessionHotelId } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const hotelId = await readSessionHotelId(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (request.nextUrl.pathname.startsWith("/admin") && !hotelId) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  if (request.nextUrl.pathname === "/login" && hotelId) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};

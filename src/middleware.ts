import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/config";
import {
  detectLocaleFromAcceptLanguage,
  LOCALE_COOKIE,
  localeCookieOptions,
  parseLocale,
  type Locale,
} from "@/lib/i18n/locales";
import { readSessionHotelId } from "@/lib/session";

const LOCALE_ONLY_PATHS: Record<string, Locale> = {
  "/pt": "pt",
  "/en": "en",
  "/es": "es",
  "/it": "it",
};

const INTEREST_PATH_HINTS: Record<string, Locale> = {
  "/interesse": "pt",
  "/en/interest": "en",
};

function withLocaleCookie(response: NextResponse, locale: Locale) {
  response.cookies.set(LOCALE_COOKIE, locale, localeCookieOptions());
  return response;
}

function applyMarketingLocale(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  const requested = parseLocale(request.nextUrl.searchParams.get("lang"));

  if (requested) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("lang");
    return withLocaleCookie(NextResponse.redirect(url), requested);
  }

  const pathLocale = LOCALE_ONLY_PATHS[pathname];
  if (pathLocale) {
    return withLocaleCookie(NextResponse.redirect(new URL("/", request.url)), pathLocale);
  }

  if (pathname.startsWith("/pt/")) {
    return withLocaleCookie(
      NextResponse.redirect(new URL("/interesse", request.url)),
      "pt",
    );
  }

  if (pathname === "/interest") {
    return withLocaleCookie(
      NextResponse.redirect(new URL("/en/interest", request.url)),
      "en",
    );
  }

  const existing = parseLocale(request.cookies.get(LOCALE_COOKIE)?.value);
  if (existing) {
    return null;
  }

  const hinted = INTEREST_PATH_HINTS[pathname];
  const detected =
    hinted ?? detectLocaleFromAcceptLanguage(request.headers.get("accept-language"));
  const response = NextResponse.next();
  return withLocaleCookie(response, detected);
}

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

  return applyMarketingLocale(request) ?? NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/interesse",
    "/interest",
    "/en",
    "/en/interest",
    "/pt",
    "/pt/:path*",
    "/es",
    "/it",
    "/admin/:path*",
    "/login",
  ],
};

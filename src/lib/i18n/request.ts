import { cookies, headers } from "next/headers";
import {
  detectLocaleFromAcceptLanguage,
  LOCALE_COOKIE,
  parseLocale,
  type Locale,
} from "@/lib/i18n/locales";
import { getMessages, type Messages } from "@/lib/i18n/messages";

export async function getRequestLocale(): Promise<Locale> {
  const store = await cookies();
  const fromCookie = parseLocale(store.get(LOCALE_COOKIE)?.value);
  if (fromCookie) {
    return fromCookie;
  }
  const headerStore = await headers();
  return detectLocaleFromAcceptLanguage(headerStore.get("accept-language"));
}

export async function getRequestMessages(): Promise<{
  locale: Locale;
  messages: Messages;
}> {
  const locale = await getRequestLocale();
  return { locale, messages: getMessages(locale) };
}

export const LOCALES = ["pt", "en", "es", "it"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "globotips_locale";

export const LOCALE_STORAGE_KEY = "globotips_locale";

export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const LOCALE_LABELS: Record<Locale, string> = {
  pt: "Português (Brasil)",
  en: "English",
  es: "Español",
  it: "Italiano",
};

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
  es: "es",
  it: "it",
};

const LOCALE_SET = new Set<string>(LOCALES);

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && LOCALE_SET.has(value));
}

export function parseLocale(value: string | null | undefined): Locale | null {
  if (!value) {
    return null;
  }
  const normalized = value.trim().toLowerCase().replace("_", "-");
  if (normalized === "pt-br" || normalized === "pt" || normalized.startsWith("pt-")) {
    return "pt";
  }
  if (normalized === "en" || normalized.startsWith("en-")) {
    return "en";
  }
  if (normalized === "es" || normalized.startsWith("es-")) {
    return "es";
  }
  if (normalized === "it" || normalized.startsWith("it-")) {
    return "it";
  }
  return null;
}

export function detectLocaleFromAcceptLanguage(
  header: string | null | undefined,
): Locale {
  if (!header) {
    return DEFAULT_LOCALE;
  }

  const parts = header.split(",").map((part) => {
    const [tag, ...params] = part.trim().split(";");
    const q = params.find((param) => param.trim().startsWith("q="));
    const quality = q ? Number.parseFloat(q.split("=")[1] ?? "1") : 1;
    return {
      tag: (tag ?? "").trim().toLowerCase(),
      quality: Number.isFinite(quality) ? quality : 0,
    };
  });

  parts.sort((a, b) => b.quality - a.quality);

  for (const { tag, quality } of parts) {
    if (!tag || quality <= 0) {
      continue;
    }
    if (tag === "pt-br" || tag === "pt" || tag.startsWith("pt-")) {
      return "pt";
    }
  }

  return DEFAULT_LOCALE;
}

export function interestPath(locale: Locale): string {
  return locale === "en" ? "/en/interest" : "/interesse";
}

export function localeCookieOptions() {
  return {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax" as const,
  };
}

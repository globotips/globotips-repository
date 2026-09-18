"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LOCALE_COOKIE,
  LOCALE_LABELS,
  LOCALE_STORAGE_KEY,
  LOCALES,
  localeCookieOptions,
  parseLocale,
  type Locale,
} from "@/lib/i18n/locales";

function persistLocale(next: Locale) {
  const { maxAge, path, sameSite } = localeCookieOptions();
  document.cookie = `${LOCALE_COOKIE}=${next}; Path=${path}; Max-Age=${maxAge}; SameSite=${sameSite}`;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
  } catch {
    // Private mode can block localStorage; the cookie is enough for SSR.
  }
}

export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = parseLocale(localStorage.getItem(LOCALE_STORAGE_KEY));
      const hasCookie = document.cookie
        .split(";")
        .some((part) => part.trim().startsWith(`${LOCALE_COOKIE}=`));
      if (stored && !hasCookie) {
        persistLocale(stored);
        router.refresh();
        return;
      }
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Ignore storage errors.
    }
  }, [locale, router]);

  return (
    <label className="inline-flex items-center gap-2 text-sm text-muted">
      <span className="sr-only">{label}</span>
      <select
        value={locale}
        aria-label={label}
        onChange={(event) => {
          const next = event.target.value as Locale;
          persistLocale(next);
          router.refresh();
        }}
        className="max-w-[11.5rem] rounded-full border border-line bg-card px-3 py-2 text-sm font-semibold text-ink outline-none ring-teal focus:ring-2"
      >
        {LOCALES.map((id) => (
          <option key={id} value={id}>
            {LOCALE_LABELS[id]}
          </option>
        ))}
      </select>
    </label>
  );
}

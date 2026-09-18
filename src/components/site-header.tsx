import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import type { Locale } from "@/lib/i18n/locales";

export function SiteHeader({
  locale,
  languageLabel,
  hotelLoginLabel,
}: {
  locale: Locale;
  languageLabel: string;
  hotelLoginLabel: string;
}) {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5">
      <Link href="/" className="min-w-0">
        <Logo wordmarkText="Travel Gratuity Group" />
      </Link>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <LanguageSwitcher locale={locale} label={languageLabel} />
        <Link
          href="/login"
          className="rounded-full bg-teal px-3 py-2 text-sm font-semibold text-white transition hover:bg-teal-deep sm:px-4"
        >
          {hotelLoginLabel}
        </Link>
      </div>
    </header>
  );
}

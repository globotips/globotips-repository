import Link from "next/link";
import { InterestForm } from "@/components/interest-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getRequestMessages } from "@/lib/i18n/request";

export async function interestSignupMetadata() {
  const { messages } = await getRequestMessages();
  return {
    title: messages.meta.interestTitle,
    description: messages.meta.interestDescription,
  };
}

export async function InterestSignup({ source }: { source: string }) {
  const { locale, messages } = await getRequestMessages();
  const copy = messages.interest;

  return (
    <div className="min-h-full">
      <SiteHeader
        locale={locale}
        languageLabel={messages.header.language}
        hotelLoginLabel={messages.header.hotelLogin}
      />
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">
          {copy.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink">{copy.title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted">{copy.lead}</p>
        <p className="mt-3 rounded-2xl border border-gold/40 bg-gold/15 px-4 py-3 text-sm leading-6 text-ink">
          {copy.waitlistNote}
        </p>
        <div className="mt-8">
          <InterestForm locale={locale} source={source} copy={copy} />
        </div>
        <p className="mt-8">
          <Link href="/" className="text-sm font-semibold text-teal hover:text-teal-deep">
            {copy.backHome}
          </Link>
        </p>
      </main>
      <SiteFooter
        host={messages.home.footerHost}
        legalEntity={messages.legalEntity}
      />
    </div>
  );
}

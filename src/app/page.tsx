import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { interestPath } from "@/lib/i18n/locales";
import { getRequestMessages } from "@/lib/i18n/request";
import type { Messages } from "@/lib/i18n/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { messages } = await getRequestMessages();
  return {
    title: messages.meta.homeTitle,
    description: messages.meta.homeDescription,
  };
}

export default async function HomePage() {
  const { locale, messages } = await getRequestMessages();
  const t = messages.home;

  return (
    <div className="min-h-full">
      <SiteHeader
        locale={locale}
        languageLabel={messages.header.language}
        hotelLoginLabel={messages.header.hotelLogin}
      />

      <main>
        <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-16 pt-6 md:grid-cols-[1.15fr_0.85fr] md:pb-24 md:pt-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">
              {t.eyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.15] text-ink sm:text-5xl">
              {t.heading}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">{t.lead}</p>
            <p className="mt-4 text-lg font-semibold text-ink">{t.cost}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={interestPath(locale)}
                className="rounded-full bg-teal px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-deep"
              >
                {t.ctaInterest}
              </Link>
              <a
                href="#how-it-works"
                className="rounded-full border border-line bg-card px-6 py-3 text-sm font-semibold text-ink transition hover:border-teal/40"
              >
                {t.ctaHow}
              </a>
            </div>
          </div>

          <HeroPhone copy={t} />
        </section>

        <section id="how-it-works" className="border-y border-line/80 bg-card/70">
          <div className="mx-auto w-full max-w-6xl px-5 py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">
              {t.howEyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink">{t.howHeading}</h2>
            <ol className="mt-10 grid gap-5 md:grid-cols-3">
              {t.steps.map((item, index) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-line bg-paper p-6"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal font-display text-lg text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 font-display text-2xl text-ink">{item.title}</h3>
                  <p className="mt-2 leading-7 text-muted">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 md:grid-cols-2">
          <div className="rounded-3xl bg-teal px-7 py-8 text-white md:px-10 md:py-12">
            <h2 className="font-display text-3xl">{t.trialHeading}</h2>
            <p className="mt-4 max-w-md text-lg leading-8 text-white/85">{t.trialBody}</p>
          </div>
          <div className="rounded-3xl border border-line bg-card px-7 py-8 md:px-10 md:py-12">
            <h2 className="font-display text-3xl text-ink">{t.foundersHeading}</h2>
            <p className="mt-4 text-lg leading-8 text-muted">{t.foundersBody}</p>
          </div>
        </section>
      </main>

      <SiteFooter host={t.footerHost} legalEntity={messages.legalEntity} />
    </div>
  );
}

function HeroPhone({ copy }: { copy: Messages["home"] }) {
  return (
    <div className="mx-auto w-full max-w-[340px]">
      <div className="rounded-[2rem] border border-line bg-ink p-2 shadow-[0_24px_60px_rgba(28,43,38,0.18)]">
        <div className="overflow-hidden rounded-[1.55rem] bg-paper">
          <div className="bg-gold/20 px-4 py-2 text-center text-[11px] font-semibold text-ink">
            {copy.phoneDemo}
          </div>
          <div className="flex flex-col items-center px-6 pb-7 pt-6">
            <div className="flex h-20 w-20 items-end justify-center rounded-full bg-gradient-to-br from-teal to-gold ring-4 ring-white">
              <span className="mb-2 font-display text-2xl text-white">MS</span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-muted">
              {copy.phoneTip}
            </p>
            <p className="font-display text-2xl">Maria Santos</p>
            <div className="mt-5 grid w-full grid-cols-3 gap-2">
              {["$5", "$10", "$20"].map((amount) => (
                <div
                  key={amount}
                  className={`rounded-xl border py-3 text-center text-sm font-semibold ${
                    amount === "$10"
                      ? "border-teal bg-teal text-white"
                      : "border-line bg-card"
                  }`}
                >
                  {amount}
                </div>
              ))}
            </div>
            <div className="mt-2 w-full rounded-xl border border-dashed border-line bg-card py-3 text-center text-sm text-muted">
              {copy.phoneCustom}
            </div>
            <div className="mt-5 w-full rounded-full bg-teal py-3 text-center text-sm font-semibold text-white">
              {copy.phonePay}
            </div>
            <p className="mt-4 text-[11px] text-muted">
              globotips.com/tip/maria-santos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  description:
    "Cashless tipping for hotels, tour guides, and cruise staff. Guests scan a QR with their phone camera. No guest app. The hotel never holds the money.",
};

export default function HomePage() {
  return (
    <div className="home-v2 min-h-full">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-6 sm:px-8">
        <Logo markClassName="h-9 w-9" />
        <Link
          href="/login"
          className="text-sm font-medium text-navy/70 transition hover:text-navy"
        >
          Hotel login
        </Link>
      </header>

      <main>
        <section className="mx-auto w-full max-w-5xl px-5 pb-20 pt-10 sm:px-8 sm:pb-28 sm:pt-16">
          <p className="text-[13px] font-medium tracking-wide text-brand sm:text-sm">
            For hotels, tour guides, and cruise staff
          </p>
          <h1 className="mt-5 max-w-3xl text-[2.35rem] font-semibold leading-[1.08] tracking-tight text-navy sm:text-6xl sm:leading-[1.05]">
            Staff lose tips when guests have no cash.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-navy/70 sm:text-lg sm:leading-8">
            A guest opens the camera, scans a QR, and tips the person who
            helped them. There is no guest app.
          </p>
          <p className="mt-5 max-w-xl text-base leading-8 text-navy sm:text-lg">
            Try it on one property. Free for 60 days. Staff keep the tips. The
            hotel pays nothing.
          </p>
          <div className="mt-10">
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-lg bg-brand px-5 py-3 text-sm font-medium text-white transition hover:bg-navy sm:w-auto"
            >
              Open the hotel demo
            </Link>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-t border-navy/10"
        >
          <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
            <h2 className="text-3xl font-semibold tracking-tight text-navy sm:text-5xl">
              Three steps.
            </h2>
            <ol className="mt-12 grid gap-10 sm:mt-16 sm:grid-cols-3 sm:gap-12">
              {[
                {
                  step: "01",
                  title: "Add employees",
                  body: "The property adds staff. Each person gets a unique tip code.",
                },
                {
                  step: "02",
                  title: "Print QRs",
                  body: "Download a PNG and print it at the desk, on a badge, or in a guest folder.",
                },
                {
                  step: "03",
                  title: "Guests tip directly",
                  body: "A guest scans and pays the person who helped them. The hotel never holds the money.",
                },
              ].map((item) => (
                <li key={item.step}>
                  <p className="text-sm font-medium text-brand">{item.step}</p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-navy/70">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-navy/10">
          <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-navy sm:text-5xl">
              No app.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-navy/70 sm:text-lg">
              Guests use the camera already on their phone. No download, no
              account, and no login.
            </p>
          </div>
        </section>

        <section className="border-t border-navy/10">
          <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-navy sm:text-5xl">
              The hotel never holds the money.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-navy/70 sm:text-lg">
              Tips go to the person who earned them. The property does not
              collect, hold, or pass through payments.
            </p>
          </div>
        </section>

        <section className="border-t border-navy/10">
          <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-navy sm:text-5xl">
              About 3%, taken from the tip.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-navy/70 sm:text-lg">
              The guest is not surcharged. After the 60-day trial, that is the
              only fee. The hotel is not billed.
            </p>
          </div>
        </section>

        <section className="border-t border-navy/10">
          <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-navy sm:text-5xl">
              Start with one property.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-navy/70 sm:text-lg">
              Add staff, print their QRs, and see if guests use them. Free for
              60 days. Staff keep the tips.
            </p>
            <div className="mt-10">
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-lg bg-brand px-5 py-3 text-sm font-medium text-white transition hover:bg-navy sm:w-auto"
              >
                Open the hotel demo
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-navy/10">
          <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
            <h2 className="text-3xl font-semibold tracking-tight text-navy sm:text-5xl">
              Founders
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-navy/70 sm:text-lg">
              GloboTips was founded by{" "}
              <span className="font-medium text-navy">Rosalie Dudkiewicz</span>,
              co-founder with{" "}
              <span className="font-medium text-navy">Dariusz Dudkiewicz</span>.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-navy/10">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-8 text-sm text-navy/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Logo className="opacity-90" />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p>globotips.com</p>
            <Link href="/print" className="hover:text-navy">
              Hotel print kit
            </Link>
            <Link href="/classic" className="hover:text-navy">
              Original homepage
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import { Logo } from "@/components/logo";

export default function HomePage() {
  return (
    <div className="min-h-full">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <Link
          href="/login"
          className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-deep"
        >
          Hotel login
        </Link>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-16 pt-6 md:grid-cols-[1.15fr_0.85fr] md:pb-24 md:pt-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">
              Cashless tipping for hotels and tour guides
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.15] text-ink sm:text-5xl">
              Staff lose tips because guests don&apos;t carry cash.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
              Guests scan a QR with their phone camera and tip the employee
              directly. No guest app. No guest account. No login.
            </p>
            <p className="mt-4 text-lg font-semibold text-ink">
              It costs the hotel nothing to try.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="rounded-full bg-teal px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-deep"
              >
                Open the hotel demo
              </Link>
              <a
                href="#how-it-works"
                className="rounded-full border border-line bg-card px-6 py-3 text-sm font-semibold text-ink transition hover:border-teal/40"
              >
                See the three steps
              </a>
            </div>
          </div>

          <HeroPhone />
        </section>

        <section
          id="how-it-works"
          className="border-y border-line/80 bg-card/70"
        >
          <div className="mx-auto w-full max-w-6xl px-5 py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink">
              Three steps. Guests tip the employee directly.
            </h2>
            <ol className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Add employees",
                  body: "The hotel adds staff. Each person gets a unique tip code.",
                },
                {
                  step: "2",
                  title: "Print QRs",
                  body: "Download a PNG for each employee and print it at the desk, on a badge, or in a guest folder.",
                },
                {
                  step: "3",
                  title: "Guests tip the employee directly",
                  body: "A guest opens the camera, scans, and pays the person who helped them. The hotel never holds the money.",
                },
              ].map((item) => (
                <li
                  key={item.step}
                  className="rounded-2xl border border-line bg-paper p-6"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal font-display text-lg text-white">
                    {item.step}
                  </span>
                  <h3 className="mt-4 font-display text-2xl text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 leading-7 text-muted">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 md:grid-cols-2">
          <div className="rounded-3xl bg-teal px-7 py-8 text-white md:px-10 md:py-12">
            <h2 className="font-display text-3xl">Free for 60 days.</h2>
            <p className="mt-4 max-w-md text-lg leading-8 text-white/85">
              After the trial, about 3% is taken from the tip. The guest is not
              surcharged. The hotel is not holding tips.
            </p>
          </div>
          <div className="rounded-3xl border border-line bg-card px-7 py-8 md:px-10 md:py-12">
            <h2 className="font-display text-3xl text-ink">Founders</h2>
            <p className="mt-4 text-lg leading-8 text-muted">
              GloboTips was founded by{" "}
              <span className="font-semibold text-ink">
                Rosalie Dudkiewicz
              </span>
              , co-founder with{" "}
              <span className="font-semibold text-ink">
                Dariusz Dudkiewicz
              </span>
              .
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <Logo className="opacity-90" />
          <p>globotips.com</p>
        </div>
      </footer>
    </div>
  );
}

function HeroPhone() {
  return (
    <div className="mx-auto w-full max-w-[340px]">
      <div className="rounded-[2rem] border border-line bg-ink p-2 shadow-[0_24px_60px_rgba(28,43,38,0.18)]">
        <div className="overflow-hidden rounded-[1.55rem] bg-paper">
          <div className="bg-gold/20 px-4 py-2 text-center text-[11px] font-semibold text-ink">
            Demo mode · no real money
          </div>
          <div className="flex flex-col items-center px-6 pb-7 pt-6">
            <div className="flex h-20 w-20 items-end justify-center rounded-full bg-gradient-to-br from-teal to-gold ring-4 ring-white">
              <span className="mb-2 font-display text-2xl text-white">MS</span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-muted">
              Tip
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
              Custom amount
            </div>
            <div className="mt-5 w-full rounded-full bg-teal py-3 text-center text-sm font-semibold text-white">
              Continue to pay
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

import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Hotel print kit",
  description:
    "Print-ready GloboTips desk cards and a one-page leave-behind for a hotel meeting.",
};

const DESK_CARDS = [
  { href: "/print/desk-card-5x7-maria-santos.pdf", label: "Maria Santos · 5 × 7 in" },
  { href: "/print/desk-card-5x7-james-okonkwo.pdf", label: "James Okonkwo · 5 × 7 in" },
  { href: "/print/desk-card-5x7-elena-rossi.pdf", label: "Elena Rossi · 5 × 7 in" },
  { href: "/print/desk-card-5x7-template.pdf", label: "Blank template · 5 × 7 in" },
  { href: "/print/desk-card-4x6-maria-santos.pdf", label: "Maria Santos · 4 × 6 in" },
  { href: "/print/desk-card-4x6-james-okonkwo.pdf", label: "James Okonkwo · 4 × 6 in" },
  { href: "/print/desk-card-4x6-elena-rossi.pdf", label: "Elena Rossi · 4 × 6 in" },
  { href: "/print/desk-card-4x6-template.pdf", label: "Blank template · 4 × 6 in" },
];

const TENTS = [
  { href: "/print/desk-card-table-tent-5x7-maria-santos.pdf", label: "Maria Santos tent" },
  { href: "/print/desk-card-table-tent-5x7-james-okonkwo.pdf", label: "James Okonkwo tent" },
  { href: "/print/desk-card-table-tent-5x7-elena-rossi.pdf", label: "Elena Rossi tent" },
  { href: "/print/desk-card-table-tent-5x7-template.pdf", label: "Blank template tent" },
];

export default function PrintKitPage() {
  return (
    <div className="home-v2 min-h-full">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/" aria-label="GloboTips home">
          <Logo markClassName="h-9 w-9" />
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-navy/70 transition hover:text-navy"
        >
          Back to home
        </Link>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-4 sm:px-8">
        <p className="text-[13px] font-medium tracking-wide text-brand sm:text-sm">
          Hotel meeting
        </p>
        <h1 className="mt-5 max-w-3xl text-[2.35rem] font-semibold leading-[1.08] tracking-tight text-navy sm:text-5xl">
          Print kit
        </h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-navy/70 sm:text-lg">
          Take these to the meeting. Each QR is for one person. Do not print one
          code for the whole hotel.
        </p>

        <section className="mt-12 border-t border-navy/10 pt-10">
          <h2 className="text-xl font-semibold tracking-tight text-navy">
            What to take
          </h2>
          <ol className="mt-6 max-w-2xl list-decimal space-y-3 pl-5 text-base leading-7 text-navy/80">
            <li>
              The letter-size one-pager — Dariusz or Rosalie version, depending
              on who is in the room. Leave two or three copies on the table.
            </li>
            <li>
              Three filled 5 × 7 desk cards (Maria Santos, James Okonkwo, Elena
              Rossi). Laminate and set them where cash tips are left.
            </li>
            <li>
              The blank template, so it is clear each new staff member gets their
              own card and QR.
            </li>
            <li>
              Business cards for Dariusz Dudkiewicz and Rosalie Dudkiewicz —
              single cards with bleed, plus letter 10-up sheets.
            </li>
            <li>Optional: table-tent PDFs.</li>
          </ol>
        </section>

        <section className="mt-12 border-t border-navy/10 pt-10">
          <h2 className="text-xl font-semibold tracking-tight text-navy">
            Hotel manager one-pager
          </h2>
          <p className="mt-3 max-w-xl text-navy/70">
            Letter size, one page. Same offer on both. Use the sheet for the
            founder who is in the room.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-navy">Dariusz Dudkiewicz</p>
              <a href="/print/hotel-one-pager.pdf" className="mt-3 block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/print/hotel-one-pager.png"
                  alt="Hotel manager one-pager for Dariusz Dudkiewicz"
                  className="w-full border border-navy/10"
                />
              </a>
              <a
                href="/print/hotel-one-pager.pdf"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand px-5 py-3 text-sm font-medium text-white transition hover:bg-navy"
              >
                Download Dariusz one-pager
              </a>
            </div>
            <div>
              <p className="text-sm font-semibold text-navy">Rosalie Dudkiewicz</p>
              <a href="/print/hotel-one-pager-rosalie.pdf" className="mt-3 block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/print/hotel-one-pager-rosalie.png"
                  alt="Hotel manager one-pager for Rosalie Dudkiewicz"
                  className="w-full border border-navy/10"
                />
              </a>
              <a
                href="/print/hotel-one-pager-rosalie.pdf"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-navy px-5 py-3 text-sm font-medium text-white transition hover:bg-brand"
              >
                Download Rosalie one-pager
              </a>
            </div>
          </div>
        </section>

        <section className="mt-12 border-t border-navy/10 pt-10">
          <h2 className="text-xl font-semibold tracking-tight text-navy">
            Room desk cards
          </h2>
          <p className="mt-3 max-w-xl text-navy/70">
            Landscape. Print actual size on cardstock, trim if needed, and
            laminate. Filled samples encode globotips.com/tip/{"{code}"}.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <a href="/print/desk-card-5x7-maria-santos.pdf">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/print/desk-card-5x7-maria-santos.png"
                alt="Filled 5 by 7 desk card for Maria Santos"
                className="w-full border border-navy/10"
              />
            </a>
            <a href="/print/desk-card-5x7-template.pdf">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/print/desk-card-5x7-template.png"
                alt="Blank 5 by 7 desk card template"
                className="w-full border border-navy/10"
              />
            </a>
          </div>
          <ul className="mt-6 space-y-2 text-sm">
            {DESK_CARDS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="font-medium text-navy hover:text-brand">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 border-t border-navy/10 pt-10">
          <h2 className="text-xl font-semibold tracking-tight text-navy">
            Table tents
          </h2>
          <p className="mt-3 max-w-xl text-navy/70">
            Two 5 × 7 faces on a 7 × 10 inch sheet. Fold in the middle.
          </p>
          <ul className="mt-6 space-y-2 text-sm">
            {TENTS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="font-medium text-navy hover:text-brand">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 border-t border-navy/10 pt-10">
          <h2 className="text-xl font-semibold tracking-tight text-navy">
            Business cards
          </h2>
          <p className="mt-3 max-w-xl text-navy/70">
            US 3.5 × 2 in with 0.125 in bleed (page is 3.75 × 2.25). Back has a
            QR to globotips.com. Print the 10-up letter sheet at a shop, duplex
            flip on the long edge, then cut on the marks.
          </p>
          <h3 className="mt-8 text-base font-semibold text-navy">
            Dariusz Dudkiewicz
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <a href="/print/business-card.pdf">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/print/business-card-front.png"
                alt="Dariusz Dudkiewicz business card front"
                className="w-full border border-navy/10"
              />
            </a>
            <a href="/print/business-card.pdf">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/print/business-card-back.png"
                alt="Dariusz Dudkiewicz business card back"
                className="w-full border border-navy/10"
              />
            </a>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/print/business-card.pdf" className="font-medium text-navy hover:text-brand">
                Single card, front and back, with bleed
              </a>
            </li>
            <li>
              <a href="/print/business-card-10up-letter.pdf" className="font-medium text-navy hover:text-brand">
                Letter 10-up sheet
              </a>
            </li>
          </ul>
          <h3 className="mt-10 text-base font-semibold text-navy">
            Rosalie Dudkiewicz
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <a href="/print/business-card-rosalie.pdf">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/print/business-card-rosalie-front.png"
                alt="Rosalie Dudkiewicz business card front"
                className="w-full border border-navy/10"
              />
            </a>
            <a href="/print/business-card-rosalie.pdf">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/print/business-card-rosalie-back.png"
                alt="Rosalie Dudkiewicz business card back"
                className="w-full border border-navy/10"
              />
            </a>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/print/business-card-rosalie.pdf" className="font-medium text-navy hover:text-brand">
                Single card, front and back, with bleed
              </a>
            </li>
            <li>
              <a href="/print/business-card-rosalie-10up-letter.pdf" className="font-medium text-navy hover:text-brand">
                Letter 10-up sheet
              </a>
            </li>
          </ul>
        </section>
      </main>

      <footer className="border-t border-navy/10">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-8 text-sm text-navy/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Logo className="opacity-90" />
          <p>globotips.com</p>
        </div>
      </footer>
    </div>
  );
}

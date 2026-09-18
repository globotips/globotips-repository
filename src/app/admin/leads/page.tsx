import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { getSessionHotel } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale } from "@/lib/i18n/locales";
import { INTEREST_ROLES, type InterestRole } from "@/lib/interest-lead";
import { logoutAction } from "../actions";

export const metadata = {
  title: "Interest leads",
};

export const dynamic = "force-dynamic";

function roleLabel(role: string, locale: string) {
  const messages = getMessages(isLocale(locale) ? locale : "en");
  if ((INTEREST_ROLES as readonly string[]).includes(role)) {
    return messages.interest.roles[role as InterestRole];
  }
  return role;
}

function formatWhen(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

export default async function AdminLeadsPage() {
  const hotel = await getSessionHotel();
  if (!hotel) {
    redirect("/login");
  }

  const leads = await prisma.interestLead.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-full">
      <header className="border-b border-line bg-card/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm font-semibold text-teal hover:text-teal-deep"
            >
              Hotel dashboard
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-sm font-semibold text-teal hover:text-teal-deep"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">
          Brazil recruiting
        </p>
        <h1 className="mt-2 font-display text-4xl">Interest leads</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Waitlist only. These people asked to be contacted when Brazil
          operations are ready. This list does not start Stripe or payments.
        </p>
        <p className="mt-2 text-sm text-muted">{leads.length} saved</p>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-card">
          <table className="w-full min-w-[56rem] text-left text-sm">
            <thead className="bg-sand/60 text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">When</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Place</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Business</th>
                <th className="px-4 py-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-muted" colSpan={7}>
                    No interest signups yet.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-t border-line align-top">
                    <td className="px-4 py-3 whitespace-nowrap text-muted">
                      {formatWhen(lead.createdAt)}
                      <div className="mt-1 text-xs uppercase tracking-wide">
                        {lead.locale}
                        {lead.source ? ` · ${lead.source}` : ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold">{lead.fullName}</td>
                    <td className="px-4 py-3">
                      <a className="text-teal hover:text-teal-deep" href={`mailto:${lead.email}`}>
                        {lead.email}
                      </a>
                      <div className="mt-1 text-muted">{lead.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      {lead.city}
                      <div className="text-muted">{lead.country}</div>
                    </td>
                    <td className="px-4 py-3">{roleLabel(lead.role, lead.locale)}</td>
                    <td className="px-4 py-3">{lead.businessName}</td>
                    <td className="px-4 py-3 text-muted">{lead.notes || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

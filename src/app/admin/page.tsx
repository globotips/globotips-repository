import Link from "next/link";
import { redirect } from "next/navigation";
import { DemoBanner } from "@/components/demo-banner";
import { Logo } from "@/components/logo";
import { getSessionHotel } from "@/lib/auth";
import { displayTipLink } from "@/lib/config";
import { prisma } from "@/lib/db";
import { dayKey, formatDayLabel, formatUsd } from "@/lib/money";
import { getStripeMode, isStripeEnabled } from "@/lib/stripe-mode";
import {
  addEmployeeAction,
  logoutAction,
  removeEmployeeAction,
  startEmployeeOnboardingAction,
} from "./actions";

export const metadata = {
  title: "Hotel dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ staffError?: string; connect?: string }>;
}) {
  const hotel = await getSessionHotel();
  if (!hotel) {
    redirect("/login");
  }

  const { staffError, connect } = await searchParams;
  const stripeMode = getStripeMode();
  const stripeReady = isStripeEnabled(stripeMode);
  const employees = await prisma.employee.findMany({
    where: { hotelId: hotel.id },
    include: { tips: { where: { status: "paid" } } },
    orderBy: { name: "asc" },
  });

  const dayTotals = new Map<string, { cents: number; count: number }>();
  const employeeRows = employees.map((employee) => {
    const cents = employee.tips.reduce((sum, tip) => sum + tip.amountCents, 0);
    for (const tip of employee.tips) {
      const key = dayKey(tip.createdAt);
      const current = dayTotals.get(key) ?? { cents: 0, count: 0 };
      current.cents += tip.amountCents;
      current.count += 1;
      dayTotals.set(key, current);
    }
    return {
      id: employee.id,
      name: employee.name,
      tipCode: employee.tipCode,
      tipCount: employee.tips.length,
      totalCents: cents,
      payoutsEnabled: employee.payoutsEnabled,
      hasStripeAccount: Boolean(employee.stripeAccountId),
    };
  });

  const days = [...dayTotals.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([day, totals]) => ({ day, ...totals }));
  const grandTotal = employeeRows.reduce((sum, row) => sum + row.totalCents, 0);
  const grandCount = employeeRows.reduce((sum, row) => sum + row.tipCount, 0);

  return (
    <div className="min-h-full">
      <DemoBanner stripeMode={stripeMode} />
      <header className="border-b border-line bg-card/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/">
            <Logo />
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
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">
          Hotel dashboard
        </p>
        <h1 className="mt-2 font-display text-4xl">{hotel.name}</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Totals only — by day and by employee. Individual tip amounts are not
          shown. The hotel never holds money.
        </p>

        {connect === "live" ? (
          <p className="mt-4 rounded-xl border border-teal/30 bg-teal/10 px-4 py-3 text-sm text-teal-deep">
            Stripe Connect onboarding is complete. That QR is live and can
            receive tips.
          </p>
        ) : null}
        {connect === "pending" ? (
          <p className="mt-4 rounded-xl border border-gold/50 bg-gold/15 px-4 py-3 text-sm">
            Onboarding was saved, but payouts are not enabled yet. Continue
            Stripe Connect for that employee. The QR stays inactive until they
            can receive payouts.
          </p>
        ) : null}
        {connect === "error" || staffError === "stripe" ? (
          <p className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            Stripe Connect could not be started. Check the Stripe keys and try
            onboarding again from the employee row.
          </p>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-card p-5">
            <p className="text-sm text-muted">All paid tips</p>
            <p className="mt-1 font-display text-3xl">{formatUsd(grandTotal)}</p>
          </div>
          <div className="rounded-2xl border border-line bg-card p-5">
            <p className="text-sm text-muted">Tip count</p>
            <p className="mt-1 font-display text-3xl">{grandCount}</p>
          </div>
        </section>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section>
            <h2 className="font-display text-2xl">Employees</h2>
            <p className="mt-1 text-sm text-muted">
              Adding an employee creates a unique tip code and a downloadable QR
              that points at <span className="text-ink">/tip/{"{code}"}</span>.
              {stripeReady
                ? " Adding a worker also starts Connect Express onboarding. The QR is live only after the worker can receive payouts."
                : null}
            </p>
            {staffError === "name" ? (
              <p className="mt-4 text-sm text-danger" role="alert">
                Enter a name to add an employee.
              </p>
            ) : null}
            <form
              action={addEmployeeAction}
              className="mt-5 flex flex-col gap-3 sm:flex-row"
            >
              <input
                name="name"
                required
                placeholder="Employee name"
                className="min-w-0 flex-1 rounded-xl border border-line bg-card px-3 py-3 outline-none ring-teal focus:ring-2"
              />
              <button
                type="submit"
                className="rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white hover:bg-teal-deep"
              >
                Add employee
              </button>
            </form>

            <ul className="mt-6 space-y-3">
              {employeeRows.map((employee) => (
                <li
                  key={employee.id}
                  className="rounded-2xl border border-line bg-card p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{employee.name}</p>
                      <p className="mt-1 text-sm text-muted">
                        {displayTipLink(employee.tipCode)}
                      </p>
                      {stripeReady ? (
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-teal">
                          {employee.payoutsEnabled
                            ? "QR live"
                            : "QR not live — payouts not enabled"}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`/api/qr/${employee.tipCode}`}
                        className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold hover:border-teal/40"
                      >
                        Download QR
                      </a>
                      {stripeReady && !employee.payoutsEnabled ? (
                        <form action={startEmployeeOnboardingAction}>
                          <input type="hidden" name="id" value={employee.id} />
                          <button
                            type="submit"
                            className="rounded-full border border-teal/40 px-3 py-1.5 text-sm font-semibold text-teal hover:bg-teal/10"
                          >
                            {employee.hasStripeAccount
                              ? "Continue Stripe"
                              : "Start Stripe"}
                          </button>
                        </form>
                      ) : null}
                      <form action={removeEmployeeAction}>
                        <input type="hidden" name="id" value={employee.id} />
                        <button
                          type="submit"
                          className="rounded-full px-3 py-1.5 text-sm font-semibold text-danger hover:bg-danger/10"
                        >
                          Remove
                        </button>
                      </form>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted">
                    {employee.tipCount} tips · {formatUsd(employee.totalCents)}{" "}
                    total
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl">Totals by day</h2>
            <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-card">
              <table className="w-full text-left text-sm">
                <thead className="bg-sand/60 text-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Day</th>
                    <th className="px-4 py-3 font-semibold">Tips</th>
                    <th className="px-4 py-3 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {days.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-muted" colSpan={3}>
                        No tips yet.
                      </td>
                    </tr>
                  ) : (
                    days.map((row) => (
                      <tr key={row.day} className="border-t border-line">
                        <td className="px-4 py-3">{formatDayLabel(row.day)}</td>
                        <td className="px-4 py-3">{row.count}</td>
                        <td className="px-4 py-3">{formatUsd(row.cents)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <h2 className="mt-8 font-display text-2xl">Totals by employee</h2>
            <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-card">
              <table className="w-full text-left text-sm">
                <thead className="bg-sand/60 text-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Employee</th>
                    <th className="px-4 py-3 font-semibold">Tips</th>
                    <th className="px-4 py-3 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeRows.map((row) => (
                    <tr key={row.id} className="border-t border-line">
                      <td className="px-4 py-3">{row.name}</td>
                      <td className="px-4 py-3">{row.tipCount}</td>
                      <td className="px-4 py-3">{formatUsd(row.totalCents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { DemoBanner } from "@/components/demo-banner";
import { InviteStatusBadge } from "@/components/invite-status-badge";
import { LegalFooter } from "@/components/legal-footer";
import { Logo } from "@/components/logo";
import { getSessionHotel } from "@/lib/auth";
import { displayJoinLink, displayTipLink } from "@/lib/config";
import { prisma } from "@/lib/db";
import {
  canDownloadTipQr,
  canShowJoinQr,
  createInviteToken,
  resolveInviteStatus,
} from "@/lib/invite";
import { dayKey, formatDayLabel, formatUsd } from "@/lib/money";
import { formatUsMobile } from "@/lib/phone";
import { getStripeMode, isStripeEnabled } from "@/lib/stripe-mode";
import {
  addEmployeeAction,
  logoutAction,
  removeEmployeeAction,
  resendInviteAction,
  updateEmployeeAction,
} from "./actions";

export const metadata = {
  title: "Hotel dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    staffError?: string;
    connect?: string;
    invited?: string;
    sms?: string;
    edit?: string;
  }>;
}) {
  const hotel = await getSessionHotel();
  if (!hotel) {
    redirect("/login");
  }

  const { staffError, connect, invited, sms, edit } = await searchParams;
  const stripeMode = getStripeMode();
  const stripeReady = isStripeEnabled(stripeMode);
  const employees = await prisma.employee.findMany({
    where: { hotelId: hotel.id },
    include: { tips: { where: { status: "paid" } } },
    orderBy: { name: "asc" },
  });

  const missingTokens = employees.filter((employee) => !employee.inviteToken);
  if (missingTokens.length > 0) {
    await Promise.all(
      missingTokens.map((employee) =>
        prisma.employee.update({
          where: { id: employee.id },
          data: { inviteToken: createInviteToken() },
        }),
      ),
    );
  }
  const staff =
    missingTokens.length > 0
      ? await prisma.employee.findMany({
          where: { hotelId: hotel.id },
          include: { tips: { where: { status: "paid" } } },
          orderBy: { name: "asc" },
        })
      : employees;

  const dayTotals = new Map<string, { cents: number; count: number }>();
  const employeeRows = staff.map((employee) => {
    const cents = employee.tips.reduce((sum, tip) => sum + tip.amountCents, 0);
    for (const tip of employee.tips) {
      const key = dayKey(tip.createdAt);
      const current = dayTotals.get(key) ?? { cents: 0, count: 0 };
      current.cents += tip.amountCents;
      current.count += 1;
      dayTotals.set(key, current);
    }
    const status = resolveInviteStatus(employee);
    return {
      id: employee.id,
      name: employee.name,
      phone: employee.phone,
      tipCode: employee.tipCode,
      inviteToken: employee.inviteToken,
      tipCount: employee.tips.length,
      totalCents: cents,
      status,
      remindAt: employee.remindAt,
    };
  });

  const days = [...dayTotals.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([day, totals]) => ({ day, ...totals }));
  const grandTotal = employeeRows.reduce((sum, row) => sum + row.totalCents, 0);
  const grandCount = employeeRows.reduce((sum, row) => sum + row.tipCount, 0);
  const invitedRow = invited
    ? employeeRows.find((row) => row.id === invited)
    : undefined;

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

        {invitedRow ? (
          <div className="mt-4 rounded-2xl border border-teal/30 bg-teal/10 px-4 py-4 text-sm text-teal-deep">
            <p className="font-semibold">
              Invite ready for {invitedRow.name}.
            </p>
            <p className="mt-1 leading-6">
              {sms === "sent"
                ? "SMS sent with the join link."
                : sms === "failed"
                  ? "SMS could not be sent. Share the join link or QR below."
                  : "Twilio is not configured, so SMS was skipped. Share the join link or printable QR — adding the employee still succeeded."}
            </p>
            {invitedRow.inviteToken ? (
              <p className="mt-2 font-semibold text-ink">
                {displayJoinLink(invitedRow.inviteToken)}
              </p>
            ) : null}
          </div>
        ) : null}

        {connect === "live" ? (
          <p className="mt-4 rounded-xl border border-teal/30 bg-teal/10 px-4 py-3 text-sm text-teal-deep">
            Stripe Connect onboarding is complete. That QR is live and can
            receive tips.
          </p>
        ) : null}
        {connect === "pending" ? (
          <p className="mt-4 rounded-xl border border-gold/50 bg-gold/15 px-4 py-3 text-sm">
            Onboarding was saved, but payouts are not enabled yet. Ask the
            employee to open Join now again. The tip QR stays inactive until
            they can receive payouts.
          </p>
        ) : null}
        {connect === "error" ? (
          <p className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            Stripe Connect could not be started. Resend the invite or have the
            employee tap Join now again.
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
              Add a US mobile. We create a join invite (SMS when Twilio is set,
              otherwise a link and printable QR). Statuses: Invited, Pending
              (remind later), Active (payouts ready), Declined. Tip QRs are live
              only for Active staff
              {stripeReady ? " after Stripe payouts are enabled" : ""}.
            </p>
            {staffError === "name" ? (
              <p className="mt-4 text-sm text-danger" role="alert">
                Enter a name to add an employee.
              </p>
            ) : null}
            {staffError === "phone" ? (
              <p className="mt-4 text-sm text-danger" role="alert">
                Enter a US mobile number (pilot). Example: (813) 555-0101.
              </p>
            ) : null}
            <form
              action={addEmployeeAction}
              className="mt-5 flex flex-col gap-3"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  name="name"
                  required
                  placeholder="Employee name"
                  className="min-w-0 flex-1 rounded-xl border border-line bg-card px-3 py-3 outline-none ring-teal focus:ring-2"
                />
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  required
                  autoComplete="tel"
                  placeholder="US mobile (813) 555-0101"
                  className="min-w-0 flex-1 rounded-xl border border-line bg-card px-3 py-3 outline-none ring-teal focus:ring-2"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white hover:bg-teal-deep sm:self-start"
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
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{employee.name}</p>
                        <InviteStatusBadge status={employee.status} />
                      </div>
                      <p className="mt-1 text-sm text-muted">
                        {employee.phone
                          ? formatUsMobile(employee.phone)
                          : "No mobile on file"}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {displayTipLink(employee.tipCode)}
                      </p>
                      {employee.status === "pending" && employee.remindAt ? (
                        <p className="mt-2 text-xs text-muted">
                          Remind after {employee.remindAt.toLocaleDateString()}
                        </p>
                      ) : null}
                      {canShowJoinQr(employee.status) && employee.inviteToken ? (
                        <p className="mt-2 text-sm text-ink">
                          Join: {displayJoinLink(employee.inviteToken)}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {canDownloadTipQr(employee.status) ? (
                        <a
                          href={`/api/qr/${employee.tipCode}?download=1`}
                          className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold hover:border-teal/40"
                        >
                          Download tip QR
                        </a>
                      ) : null}
                      {canShowJoinQr(employee.status) && employee.inviteToken ? (
                        <a
                          href={`/api/qr/join/${employee.inviteToken}?download=1`}
                          className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold hover:border-teal/40"
                        >
                          Download join QR
                        </a>
                      ) : null}
                      {employee.status !== "active" ? (
                        <form action={resendInviteAction}>
                          <input type="hidden" name="id" value={employee.id} />
                          <button
                            type="submit"
                            className="rounded-full border border-teal/40 px-3 py-1.5 text-sm font-semibold text-teal hover:bg-teal/10"
                          >
                            Resend invite
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

                  {canShowJoinQr(employee.status) && employee.inviteToken ? (
                    <div className="mt-4 flex flex-wrap items-start gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/api/qr/join/${employee.inviteToken}`}
                        alt={`Join QR for ${employee.name}`}
                        className="h-28 w-28 rounded-xl border border-line bg-card"
                      />
                      <p className="max-w-xs text-xs leading-5 text-muted">
                        Print or download this join QR for Invited staff. The
                        tip QR stays off until they are Active.
                      </p>
                    </div>
                  ) : null}

                  <details
                    className="mt-4"
                    open={edit === employee.id || (!employee.phone && staffError === "phone")}
                  >
                    <summary className="cursor-pointer text-sm font-semibold text-teal">
                      Edit name or mobile
                    </summary>
                    <form
                      action={updateEmployeeAction}
                      className="mt-3 flex flex-col gap-3 sm:flex-row"
                    >
                      <input type="hidden" name="id" value={employee.id} />
                      <input
                        name="name"
                        required
                        defaultValue={employee.name}
                        className="min-w-0 flex-1 rounded-xl border border-line bg-paper px-3 py-2 outline-none ring-teal focus:ring-2"
                      />
                      <input
                        name="phone"
                        type="tel"
                        required
                        defaultValue={
                          employee.phone ? formatUsMobile(employee.phone) : ""
                        }
                        placeholder="US mobile"
                        className="min-w-0 flex-1 rounded-xl border border-line bg-paper px-3 py-2 outline-none ring-teal focus:ring-2"
                      />
                      <button
                        type="submit"
                        className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-teal/40"
                      >
                        Save
                      </button>
                    </form>
                  </details>

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
        <LegalFooter className="mt-12" />
      </main>
    </div>
  );
}

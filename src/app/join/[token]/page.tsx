import { notFound } from "next/navigation";
import { Logo } from "@/components/logo";
import { LegalFooter } from "@/components/legal-footer";
import { GUEST_BRAND_NAME } from "@/lib/brand";
import { displayTipLink } from "@/lib/config";
import { prisma } from "@/lib/db";
import { INVITE_STATUS, INVITE_STATUS_LABEL, resolveInviteStatus } from "@/lib/invite";
import { getStripeMode, isStripeEnabled } from "@/lib/stripe-mode";
import { syncEmployeeConnectStatus } from "@/lib/stripe";
import {
  declineInviteAction,
  joinNowAction,
  remindLaterAction,
} from "./actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Join",
};

export default async function StaffJoinPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ stripe?: string; choice?: string }>;
}) {
  const { token } = await params;
  const query = await searchParams;
  if (token === "not-found") {
    notFound();
  }

  let employee = await prisma.employee.findUnique({
    where: { inviteToken: token },
    include: { hotel: true },
  });
  if (!employee) {
    notFound();
  }

  if (query.stripe === "return" && employee.stripeAccountId && isStripeEnabled(getStripeMode())) {
    try {
      const synced = await syncEmployeeConnectStatus(employee);
      employee = await prisma.employee.findUniqueOrThrow({
        where: { id: synced.id },
        include: { hotel: true },
      });
    } catch {
      // Stay on the join page; staff can tap Join now again.
    }
  }

  const status = resolveInviteStatus(employee);
  const stripeReady = isStripeEnabled(getStripeMode());

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col bg-paper">
      <header className="flex items-center justify-center px-5 py-5">
        <Logo markClassName="h-7 w-7" />
      </header>
      <main className="flex flex-1 flex-col px-5 pb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">
          Staff invite
        </p>
        <h1 className="mt-2 font-display text-3xl leading-tight">
          {employee.hotel.name} invited you
        </h1>
        <p className="mt-3 text-lg text-ink">{employee.name}</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Receive guest tips directly with {GUEST_BRAND_NAME}. The hotel never
          holds the money. About 3% is taken from the tip. Guests are not
          surcharged.
        </p>

        {status === INVITE_STATUS.active ? (
          <div className="mt-8 rounded-2xl border border-teal/30 bg-teal/10 px-4 py-4 text-sm leading-6 text-teal-deep">
            You are Active — payouts are ready. Guests can tip you at{" "}
            <span className="font-semibold text-ink">
              {displayTipLink(employee.tipCode)}
            </span>
            .
          </div>
        ) : null}

        {query.choice === "pending" && status === INVITE_STATUS.pending ? (
          <div className="mt-8 rounded-2xl border border-gold/50 bg-gold/15 px-4 py-4 text-sm leading-6">
            Saved. We will treat this as Pending — remind in 7 days. You can
            still join now if you change your mind.
          </div>
        ) : null}

        {query.choice === "declined" && status === INVITE_STATUS.declined ? (
          <div className="mt-8 rounded-2xl border border-line bg-card px-4 py-4 text-sm leading-6 text-muted">
            You declined tips for this property. Your hotel can send a new
            invite if you change your mind, or you can join now below.
          </div>
        ) : null}

        {query.stripe === "unavailable" ? (
          <p className="mt-6 rounded-2xl border border-gold/50 bg-gold/15 px-4 py-3 text-sm leading-6">
            Stripe is not configured yet. Your hotel can still share this link.
            Join now will work once payouts are connected.
          </p>
        ) : null}
        {query.stripe === "error" ? (
          <p className="mt-6 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            Stripe onboarding could not be started. Try Join now again.
          </p>
        ) : null}
        {query.stripe === "return" && status !== INVITE_STATUS.active ? (
          <p className="mt-6 rounded-2xl border border-gold/50 bg-gold/15 px-4 py-3 text-sm leading-6">
            Stripe saved your progress, but payouts are not active yet. Tap Join
            now to continue. Your tip QR stays off until payouts are ready.
          </p>
        ) : null}

        {status !== INVITE_STATUS.active ? (
          <div className="mt-8 space-y-3">
            <form action={joinNowAction}>
              <input type="hidden" name="token" value={token} />
              <button
                type="submit"
                className="w-full rounded-full bg-teal py-3.5 text-sm font-semibold text-white hover:bg-teal-deep"
              >
                Join now
              </button>
            </form>
            {stripeReady ? (
              <p className="text-center text-xs text-muted">
                Opens Stripe Express so you can receive payouts.
              </p>
            ) : null}
            <form action={remindLaterAction}>
              <input type="hidden" name="token" value={token} />
              <button
                type="submit"
                className="w-full rounded-full border border-line bg-card py-3.5 text-sm font-semibold text-ink hover:border-teal/40"
              >
                Not now — remind me in 7 days
              </button>
            </form>
            <form action={declineInviteAction}>
              <input type="hidden" name="token" value={token} />
              <button
                type="submit"
                className="w-full py-3 text-sm font-semibold text-danger hover:underline"
              >
                Decline for this property
              </button>
            </form>
          </div>
        ) : null}

        <p className="mt-10 text-center text-xs uppercase tracking-[0.14em] text-muted">
          Status: {INVITE_STATUS_LABEL[status]}
        </p>
      </main>
      <LegalFooter className="px-5 pb-8" />
    </div>
  );
}

import { notFound } from "next/navigation";
import { DemoBanner } from "@/components/demo-banner";
import { Logo } from "@/components/logo";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import { prisma } from "@/lib/db";
import { confirmCheckoutSessionForTip } from "@/lib/stripe";
import { getStripeMode } from "@/lib/stripe-mode";
import { parseTipCheckoutPayError } from "@/lib/tip-checkout";
import { TipCheckout, type TipPayMode } from "./tip-checkout";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const employee = await prisma.employee.findUnique({
    where: { tipCode: code },
  });
  if (!employee) {
    return { title: "Tip page" };
  }
  return { title: `Tip ${employee.name}` };
}

export default async function TipPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{
    session_id?: string;
    paid?: string;
    canceled?: string;
    pay_error?: string;
  }>;
}) {
  const { code } = await params;
  const query = await searchParams;
  const employee = await prisma.employee.findUnique({
    where: { tipCode: code },
    include: { hotel: true },
  });
  if (!employee) {
    notFound();
  }

  const mode = getStripeMode();
  const payMode: TipPayMode =
    mode.kind === "test" || mode.kind === "live"
      ? "stripe"
      : mode.kind === "blocked"
        ? "blocked"
        : "demo";
  const stripeKind = mode.kind === "live" ? "live" : "test";

  let initialPaidCents: number | null = null;
  if (payMode === "stripe" && query.session_id) {
    try {
      initialPaidCents = await confirmCheckoutSessionForTip(code, query.session_id);
    } catch {
      initialPaidCents = null;
    }
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col bg-paper">
      <DemoBanner compact stripeMode={mode} />
      <header className="flex items-center justify-center px-5 py-4">
        <Logo markClassName="h-7 w-7" />
      </header>
      <main className="flex flex-1 flex-col px-5 pb-10">
        <div className="flex flex-col items-center pt-2">
          <PhotoPlaceholder name={employee.name} size={120} />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-teal">
            Tip
          </p>
          <h1 className="mt-1 text-center font-display text-3xl">
            {employee.name}
          </h1>
          <p className="mt-1 text-sm text-muted">{employee.hotel.name}</p>
        </div>
        <TipCheckout
          code={employee.tipCode}
          name={employee.name}
          payMode={payMode}
          stripeKind={stripeKind}
          payoutsEnabled={employee.payoutsEnabled}
          blockedReason={mode.kind === "blocked" ? mode.reason : undefined}
          initialPaidCents={initialPaidCents}
          canceled={query.canceled === "1"}
          payError={parseTipCheckoutPayError(query.pay_error)}
        />
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState, type FormEvent } from "react";
import { recordDemoTipAction } from "@/app/tip/[code]/actions";
import { formatUsd, parseUsdToCents } from "@/lib/money";
import { TIP_CHECKOUT_PATH } from "@/lib/tip-checkout";

const PRESETS = [500, 1000, 2000];

type Step = "amount" | "pay" | "done";

export type TipPayMode = "demo" | "stripe" | "blocked";

export function TipCheckout({
  code,
  name,
  payMode,
  stripeKind = "test",
  payoutsEnabled,
  blockedReason,
  initialPaidCents = null,
  canceled = false,
  payError = null,
}: {
  code: string;
  name: string;
  payMode: TipPayMode;
  stripeKind?: "test" | "live";
  payoutsEnabled: boolean;
  blockedReason?: string;
  initialPaidCents?: number | null;
  canceled?: boolean;
  payError?: string | null;
}) {
  const [step, setStep] = useState<Step>(initialPaidCents ? "done" : "amount");
  const [preset, setPreset] = useState<number | "custom" | null>(1000);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState<string | null>(
    payError ?? (canceled ? "Checkout was canceled. Choose an amount to try again." : null),
  );
  const [pending, setPending] = useState(false);
  const [paidCents, setPaidCents] = useState<number | null>(initialPaidCents);

  const amountCents =
    preset === "custom" ? parseUsdToCents(custom) : preset;
  const stripeLive = payMode === "stripe" && payoutsEnabled;

  useEffect(() => {
    function handlePageShow() {
      setPending(false);
    }
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  useEffect(() => {
    if (!pending) {
      return;
    }
    const timer = window.setTimeout(() => {
      setPending(false);
      setError("Checkout did not open. Try Pay again.");
    }, 30_000);
    return () => window.clearTimeout(timer);
  }, [pending]);

  function continueToPay() {
    if (!amountCents) {
      setError("Choose $5, $10, $20, or a custom amount of at least $1.");
      return;
    }
    setError(null);
    setStep("pay");
  }

  function onStripePaySubmit(event: FormEvent<HTMLFormElement>) {
    if (!amountCents) {
      event.preventDefault();
      setPending(false);
      setError("Choose $5, $10, $20, or a custom amount of at least $1.");
      return;
    }
    setError(null);
    setPending(true);
  }

  async function submitDemoPay() {
    if (!amountCents) {
      setError("Choose a tip of at least $1.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const result = await recordDemoTipAction(code, amountCents);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setPaidCents(result.amountCents);
      setStep("done");
    } catch {
      setError("Demo checkout did not finish. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (step === "done" && paidCents !== null) {
    return (
      <div className="mt-8 rounded-3xl border border-line bg-card p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">
          {payMode === "stripe" ? "Tip sent" : "Demo complete"}
        </p>
        <h2 className="mt-2 font-display text-2xl">
          Thank you for tipping {name}
        </h2>
        <p className="mt-3 text-lg">{formatUsd(paidCents)}</p>
        <p className="mt-4 text-sm leading-6 text-muted">
          {payMode === "stripe"
            ? stripeKind === "live"
              ? "Paid through Stripe Checkout. The guest was not surcharged. GloboTips keeps 3% from the tip. The hotel never holds money."
              : "Paid through Stripe Checkout in test mode. The guest was not surcharged. GloboTips keeps 3% from the tip."
            : "This was demo mode. No card was charged and no real money moved."}
        </p>
        <button
          type="button"
          onClick={() => {
            setStep("amount");
            setPaidCents(null);
          }}
          className="mt-6 text-sm font-semibold text-teal"
        >
          {payMode === "stripe" ? "Send another tip" : "Send another demo tip"}
        </button>
      </div>
    );
  }

  if (payMode === "blocked") {
    return (
      <div className="mt-8 rounded-2xl border border-danger/30 bg-danger/10 p-5 text-sm leading-6 text-danger">
        {blockedReason ??
          "Stripe is blocked. Use sk_test_ locally, or set STRIPE_MODE=live and NODE_ENV=production on the host for live keys."}
      </div>
    );
  }

  if (payMode === "stripe" && !payoutsEnabled) {
    return (
      <div className="mt-8">
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((cents) => (
            <div
              key={cents}
              className="rounded-2xl border border-line bg-card py-4 text-center text-lg font-semibold text-muted"
            >
              {formatUsd(cents)}
            </div>
          ))}
        </div>
        <div className="mt-2 w-full rounded-2xl border border-dashed border-line bg-card py-4 text-center text-sm text-muted">
          Custom amount
        </div>
        <div className="mt-6 rounded-2xl border border-gold/50 bg-gold/15 px-4 py-3 text-sm leading-6">
          This QR is not live yet. {name} still needs to finish Stripe Connect
          Express onboarding so payouts can be received.
        </div>
      </div>
    );
  }

  if (step === "pay" && amountCents && payMode === "demo") {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submitDemoPay();
        }}
        className="mt-8 space-y-4"
      >
        <div className="rounded-2xl border border-gold/50 bg-gold/15 px-4 py-3 text-sm">
          <strong>Demo checkout.</strong> Stripe keys are not set, so this
          records a local tip only. Nothing is charged.
        </div>
        <div className="rounded-2xl border border-line bg-card p-4">
          <p className="text-sm text-muted">You are tipping {name}</p>
          <p className="mt-1 font-display text-3xl">{formatUsd(amountCents)}</p>
        </div>
        <label className="block">
          <span className="text-sm font-semibold">Name on card</span>
          <input
            name="cardName"
            required
            autoComplete="cc-name"
            placeholder="Guest name"
            className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-3 outline-none ring-teal focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Card number</span>
          <input
            name="cardNumber"
            required
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="ACCT-000015"
            className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-3 outline-none ring-teal focus:ring-2"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-semibold">Expiry</span>
            <input
              name="cardExpiry"
              required
              autoComplete="cc-exp"
              placeholder="MM/YY"
              className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-3 outline-none ring-teal focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">CVC</span>
            <input
              name="cardCvc"
              required
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-3 outline-none ring-teal focus:ring-2"
            />
          </label>
        </div>
        {error ? (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-teal py-3.5 text-sm font-semibold text-white hover:bg-teal-deep disabled:opacity-60"
        >
          {pending ? "Recording demo…" : `Pay ${formatUsd(amountCents)} — demo`}
        </button>
        <button
          type="button"
          onClick={() => setStep("amount")}
          className="w-full py-2 text-sm font-semibold text-muted"
        >
          Change amount
        </button>
      </form>
    );
  }

  const amountFields = (
    <>
      <div className="grid grid-cols-3 gap-2">
        {PRESETS.map((cents) => (
          <button
            key={cents}
            type="button"
            onClick={() => {
              setPreset(cents);
              setError(null);
            }}
            className={`rounded-2xl border py-4 text-lg font-semibold ${
              preset === cents
                ? "border-teal bg-teal text-white"
                : "border-line bg-card text-ink"
            }`}
          >
            {formatUsd(cents)}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          setPreset("custom");
          setError(null);
        }}
        className={`mt-2 w-full rounded-2xl border py-4 text-sm font-semibold ${
          preset === "custom"
            ? "border-teal bg-card text-ink"
            : "border-dashed border-line bg-card text-muted"
        }`}
      >
        Custom amount
      </button>
      {preset === "custom" ? (
        <label className="mt-3 block">
          <span className="text-sm font-semibold">Amount (USD)</span>
          <input
            type="number"
            min="1"
            step="0.01"
            inputMode="decimal"
            value={custom}
            onChange={(event) => setCustom(event.target.value)}
            placeholder="0.00"
            className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-3 outline-none ring-teal focus:ring-2"
          />
        </label>
      ) : null}
      {error ? (
        <p className="mt-3 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );

  if (stripeLive) {
    return (
      <form
        method="POST"
        action={TIP_CHECKOUT_PATH}
        onSubmit={onStripePaySubmit}
        className="mt-8"
      >
        <input type="hidden" name="code" value={code} />
        <input type="hidden" name="amountCents" value={amountCents ?? ""} />
        {amountFields}
        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-full bg-teal py-3.5 text-sm font-semibold text-white hover:bg-teal-deep disabled:opacity-60"
        >
          {pending
            ? "Opening Checkout…"
            : amountCents
              ? `Pay ${formatUsd(amountCents)}`
              : "Pay"}
        </button>
        <p className="mt-4 text-center text-xs leading-5 text-muted">
          Apple Pay, Google Pay, or card via Stripe Checkout. No guest account.
        </p>
      </form>
    );
  }

  return (
    <div className="mt-8">
      {amountFields}
      <button
        type="button"
        onClick={continueToPay}
        disabled={pending}
        className="mt-6 w-full rounded-full bg-teal py-3.5 text-sm font-semibold text-white hover:bg-teal-deep disabled:opacity-60"
      >
        Continue to pay
      </button>
      <p className="mt-4 text-center text-xs leading-5 text-muted">
        {`No guest account. globotips.com/tip/${code}`}
      </p>
    </div>
  );
}

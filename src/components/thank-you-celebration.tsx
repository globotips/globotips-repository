"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { formatUsd } from "@/lib/money";
import { tipThankYouCopy, type TipThankYouPayMode } from "@/lib/tip-thank-you";

const PETALS = [
  { left: "4%", delay: "-4s", duration: "18s", size: 16, color: "#c48b86", sway: "22px" },
  { left: "11%", delay: "-9s", duration: "16s", size: 12, color: "#7a8eaa", sway: "-18px" },
  { left: "18%", delay: "-2s", duration: "20s", size: 18, color: "#c4a15a", sway: "16px" },
  { left: "26%", delay: "-11s", duration: "15s", size: 13, color: "#6d8f86", sway: "-24px" },
  { left: "33%", delay: "-6s", duration: "19s", size: 15, color: "#d4a09a", sway: "20px" },
  { left: "41%", delay: "-13s", duration: "17s", size: 17, color: "#5e7a75", sway: "-14px" },
  { left: "48%", delay: "-1s", duration: "21s", size: 14, color: "#7a8eaa", sway: "26px" },
  { left: "56%", delay: "-8s", duration: "16s", size: 16, color: "#c48b86", sway: "-20px" },
  { left: "63%", delay: "-3s", duration: "18s", size: 12, color: "#c4a15a", sway: "15px" },
  { left: "71%", delay: "-12s", duration: "14s", size: 19, color: "#7a8eaa", sway: "-22px" },
  { left: "78%", delay: "-5s", duration: "20s", size: 13, color: "#6d8f86", sway: "18px" },
  { left: "86%", delay: "-10s", duration: "17s", size: 15, color: "#d4a09a", sway: "-16px" },
  { left: "93%", delay: "-7s", duration: "19s", size: 14, color: "#c4a15a", sway: "12px" },
  { left: "8%", delay: "-14s", duration: "15s", size: 11, color: "#5e7a75", sway: "10px" },
  { left: "52%", delay: "-16s", duration: "22s", size: 17, color: "#c48b86", sway: "-12px" },
  { left: "67%", delay: "-15s", duration: "16s", size: 12, color: "#7a8eaa", sway: "19px" },
  { left: "22%", delay: "-17s", duration: "18s", size: 14, color: "#c4a15a", sway: "-15px" },
  { left: "89%", delay: "-18s", duration: "21s", size: 13, color: "#6d8f86", sway: "14px" },
] as const;

function useAllowsCelebrationMotion() {
  const [allowsMotion, setAllowsMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAllowsMotion(!media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return allowsMotion;
}

function FallingPetals() {
  const allowsMotion = useAllowsCelebrationMotion();
  if (!allowsMotion) {
    return null;
  }

  return (
    <div className="thank-you-petals" aria-hidden="true">
      {PETALS.map((petal, index) => (
        <span
          key={`${petal.left}-${index}`}
          className="thank-you-petal"
          style={
            {
              "--left": petal.left,
              "--delay": petal.delay,
              "--duration": petal.duration,
              "--size": `${petal.size}px`,
              "--color": petal.color,
              "--sway": petal.sway,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

const floralMark = (
  <svg
    viewBox="0 0 64 64"
    className="mx-auto h-14 w-14"
    aria-hidden="true"
  >
    <circle cx="32" cy="32" r="7" fill="#c4a15a" />
    <ellipse cx="32" cy="16" rx="8" ry="12" fill="#0d5c4d" opacity="0.88" />
    <ellipse
      cx="32"
      cy="16"
      rx="8"
      ry="12"
      fill="#9bb5ae"
      opacity="0.9"
      transform="rotate(72 32 32)"
    />
    <ellipse
      cx="32"
      cy="16"
      rx="8"
      ry="12"
      fill="#1c4a6e"
      opacity="0.55"
      transform="rotate(144 32 32)"
    />
    <ellipse
      cx="32"
      cy="16"
      rx="8"
      ry="12"
      fill="#0d5c4d"
      opacity="0.75"
      transform="rotate(216 32 32)"
    />
    <ellipse
      cx="32"
      cy="16"
      rx="8"
      ry="12"
      fill="#7d9aa3"
      opacity="0.85"
      transform="rotate(288 32 32)"
    />
    <circle cx="32" cy="32" r="5" fill="#e8dfd0" />
    <circle cx="32" cy="32" r="2.4" fill="#c4a15a" />
  </svg>
);

export function ThankYouCelebration({
  name,
  amountCents,
  payMode,
  stripeKind,
  onSendAnother,
}: {
  name: string;
  amountCents: number;
  payMode: TipThankYouPayMode;
  stripeKind: "test" | "live";
  onSendAnother: () => void;
}) {
  const copy = tipThankYouCopy({ name, payMode, stripeKind });

  return (
    <>
      <FallingPetals />
      <section
        className="thank-you-card relative z-20 mt-8 overflow-hidden rounded-3xl border border-line bg-card px-6 py-10 text-center shadow-[0_18px_48px_rgba(28,43,38,0.08)]"
        aria-live="polite"
        aria-atomic="true"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#e8dfd0_0%,transparent_58%)]"
          aria-hidden="true"
        />
        <div className="relative">
          {floralMark}
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-teal">
            {copy.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-4xl leading-tight text-ink">
            {copy.heading}
          </h2>
          <p className="mt-3 text-lg leading-7 text-ink">{copy.confirmation}</p>
          <p className="mt-5 inline-flex rounded-full bg-sand px-4 py-1.5 font-display text-2xl text-teal-deep">
            {formatUsd(amountCents)}
          </p>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-muted">
            {copy.detail}
          </p>
          <p className="mt-6 font-display text-sm italic text-muted">
            {copy.signoff}
          </p>
          <button
            type="button"
            onClick={onSendAnother}
            className="mt-8 text-sm font-semibold text-teal"
          >
            {copy.againLabel}
          </button>
        </div>
      </section>
    </>
  );
}

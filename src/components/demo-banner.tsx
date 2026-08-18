export function DemoBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`border-b border-gold/40 bg-gold/15 text-center text-ink ${
        compact ? "px-4 py-2 text-xs" : "px-4 py-2.5 text-sm"
      }`}
    >
      <strong className="font-semibold">Demo mode.</strong> Checkout is shown
      so you can try the flow. No real money is taken.
    </div>
  );
}

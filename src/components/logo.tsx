export function Logo({
  className = "",
  markClassName = "h-8 w-8",
  wordmark = true,
  compact = false,
}: {
  className?: string;
  markClassName?: string;
  wordmark?: boolean;
  compact?: boolean;
}) {
  const markSize = compact ? "h-7 w-7" : markClassName;
  const textSize = compact ? "text-[17px]" : "text-xl";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src="/globotips-mark.svg"
        alt={wordmark ? "" : "GloboTips"}
        className={`${markSize} shrink-0`}
      />
      {wordmark ? (
        <span
          className={`font-logo font-bold tracking-tight whitespace-nowrap ${textSize}`}
        >
          <span className="text-navy">Globo</span>
          <span className="text-brand">Tips</span>
        </span>
      ) : null}
    </span>
  );
}

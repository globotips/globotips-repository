import { GUEST_BRAND_NAME } from "@/lib/brand";

export function Logo({
  className = "",
  markClassName = "h-8 w-8",
  wordmark = true,
}: {
  className?: string;
  markClassName?: string;
  wordmark?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 32 32"
        className={`${markClassName} shrink-0`}
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill="#0d5c4d" />
        <circle
          cx="16"
          cy="16"
          r="7.5"
          fill="none"
          stroke="#f4efe6"
          strokeWidth="1.6"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="3.2"
          ry="7.5"
          fill="none"
          stroke="#f4efe6"
          strokeWidth="1.6"
        />
        <path
          d="M8.8 16h14.4M10.2 12.2h11.6M10.2 19.8h11.6"
          stroke="#c4a15a"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      {wordmark ? (
        <span className="font-display text-base leading-tight tracking-tight text-ink sm:text-xl">
          {GUEST_BRAND_NAME}
        </span>
      ) : null}
    </span>
  );
}

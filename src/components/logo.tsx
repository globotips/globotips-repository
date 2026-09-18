import Image from "next/image";

export function Logo({
  className = "",
  markClassName = "h-9 w-auto",
  wordmark = true,
  wordmarkText = "Travel Gratuity Group",
}: {
  className?: string;
  markClassName?: string;
  wordmark?: boolean;
  wordmarkText?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/brand/logo-mark.png"
        alt={wordmark ? "" : wordmarkText}
        width={663}
        height={485}
        className={`shrink-0 ${markClassName}`}
      />
      {wordmark ? (
        <span className="font-display text-lg leading-tight tracking-tight text-ink sm:text-xl">
          {wordmarkText}
        </span>
      ) : null}
    </span>
  );
}

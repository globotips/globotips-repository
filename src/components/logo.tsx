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
  const isGuestBrand = wordmarkText === "Travel Gratuity Group";

  return (
    <span className={`inline-flex min-w-0 items-center gap-2.5 ${className}`}>
      <Image
        src="/brand/logo-mark.png"
        alt={wordmark ? "" : wordmarkText}
        width={663}
        height={485}
        className={`shrink-0 ${markClassName}`}
      />
      {wordmark ? (
        isGuestBrand ? (
          <span className="flex flex-col font-display leading-[1.1] tracking-tight">
            <span className="whitespace-nowrap text-sm text-ink sm:text-lg">
              Travel Gratuity
            </span>
            <span className="whitespace-nowrap text-sm text-[#00A57B] sm:text-lg">
              Group
            </span>
          </span>
        ) : (
          <span className="font-display text-lg leading-tight tracking-tight text-ink sm:text-xl">
            {wordmarkText}
          </span>
        )
      ) : null}
    </span>
  );
}

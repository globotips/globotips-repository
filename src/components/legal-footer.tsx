import { LEGAL_FOOTER } from "@/lib/brand";

export function LegalFooter({ className = "" }: { className?: string }) {
  return (
    <p className={`text-center text-xs leading-5 text-muted ${className}`}>
      {LEGAL_FOOTER}
    </p>
  );
}

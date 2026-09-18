import { Logo } from "@/components/logo";

export function SiteFooter({
  host,
  legalEntity,
}: {
  host: string;
  legalEntity: string;
}) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <Logo className="opacity-90" wordmarkText="Travel Gratuity Group" />
        <p>
          {host} · {legalEntity}
        </p>
      </div>
    </footer>
  );
}

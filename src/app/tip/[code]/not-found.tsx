import Link from "next/link";
import { Logo } from "@/components/logo";

export default function TipNotFound() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center justify-center px-5 text-center">
      <Logo />
      <h1 className="mt-8 font-display text-3xl">This tip page was not found</h1>
      <p className="mt-3 text-muted">
        The QR code or link does not match an employee.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white"
      >
        Back to GloboTips
      </Link>
    </div>
  );
}

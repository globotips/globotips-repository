import Link from "next/link";
import { Logo } from "@/components/logo";
import { GUEST_BRAND_NAME } from "@/lib/brand";

export default function JoinNotFound() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center justify-center px-5 text-center">
      <Logo />
      <h1 className="mt-8 font-display text-3xl">This invite was not found</h1>
      <p className="mt-3 text-muted">
        Ask your hotel to resend the join link.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white"
      >
        Back to {GUEST_BRAND_NAME}
      </Link>
    </div>
  );
}

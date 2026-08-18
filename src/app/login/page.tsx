import Link from "next/link";
import { Logo } from "@/components/logo";
import { loginAction } from "@/app/admin/actions";

export const metadata = {
  title: "Hotel login",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-full flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <Link href="/">
          <Logo />
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 pb-16">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">
          Hotel admin
        </p>
        <h1 className="mt-3 font-display text-4xl">Sign in</h1>
        <p className="mt-3 text-muted">
          Use the seeded Tampa demo hotel. Password is in the README and{" "}
          <code className="text-ink">.env.example</code>.
        </p>
        {error ? (
          <p
            className="mt-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
            role="alert"
          >
            That email or password did not match.
          </p>
        ) : null}
        <form action={loginAction} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">Email</span>
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              defaultValue="tampa@globotips.com"
              className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-3 outline-none ring-teal focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-3 outline-none ring-teal focus:ring-2"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-teal py-3 text-sm font-semibold text-white transition hover:bg-teal-deep"
          >
            Sign in
          </button>
        </form>
      </main>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import {
  submitInterestAction,
  type InterestFormState,
} from "@/app/interesse/actions";
import { DEFAULT_INTEREST_COUNTRY, INTEREST_ROLES } from "@/lib/interest-lead";
import type { Locale } from "@/lib/i18n/locales";
import type { Messages } from "@/lib/i18n/messages";

const INITIAL: InterestFormState | null = null;

export function InterestForm({
  locale,
  source,
  copy,
}: {
  locale: Locale;
  source: string;
  copy: Messages["interest"];
}) {
  const [state, action, pending] = useActionState(submitInterestAction, INITIAL);

  if (state?.ok) {
    return (
      <div className="rounded-3xl border border-teal/30 bg-teal/10 px-6 py-8">
        <h2 className="font-display text-3xl text-ink">{copy.thanksTitle}</h2>
        <p className="mt-4 max-w-xl text-lg leading-8 text-muted">{copy.thanksBody}</p>
        <a
          href={source === "en/interest" ? "/en/interest" : "/interesse"}
          className="mt-6 inline-flex rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white hover:bg-teal-deep"
        >
          {copy.thanksAgain}
        </a>
      </div>
    );
  }

  return (
    <form action={action} className="relative space-y-4">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="source" value={source} />
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state && !state.ok ? (
        <p
          className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}

      <label className="block">
        <span className="text-sm font-semibold">{copy.fullName}</span>
        <input
          name="fullName"
          required
          autoComplete="name"
          className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-3 outline-none ring-teal focus:ring-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{copy.email}</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-3 outline-none ring-teal focus:ring-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{copy.phone}</span>
        <input
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-3 outline-none ring-teal focus:ring-2"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">{copy.country}</span>
          <input
            name="country"
            defaultValue={DEFAULT_INTEREST_COUNTRY}
            autoComplete="country-name"
            className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-3 outline-none ring-teal focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">{copy.city}</span>
          <input
            name="city"
            required
            autoComplete="address-level2"
            className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-3 outline-none ring-teal focus:ring-2"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-semibold">{copy.role}</span>
        <select
          name="role"
          required
          defaultValue="hotel"
          className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-3 outline-none ring-teal focus:ring-2"
        >
          {INTEREST_ROLES.map((role) => (
            <option key={role} value={role}>
              {copy.roles[role]}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{copy.businessName}</span>
        <input
          name="businessName"
          required
          className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-3 outline-none ring-teal focus:ring-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{copy.notes}</span>
        <textarea
          name="notes"
          rows={4}
          className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-3 outline-none ring-teal focus:ring-2"
        />
        <span className="mt-1.5 block text-sm text-muted">{copy.notesHint}</span>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-teal py-3 text-sm font-semibold text-white transition hover:bg-teal-deep disabled:opacity-70"
      >
        {pending ? copy.submitting : copy.submit}
      </button>
    </form>
  );
}

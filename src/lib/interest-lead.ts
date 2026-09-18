import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/locales";

export const INTEREST_ROLES = [
  "hotel",
  "agency",
  "guide",
  "driver",
  "other",
] as const;

export type InterestRole = (typeof INTEREST_ROLES)[number];

export const DEFAULT_INTEREST_COUNTRY = "Brasil";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLE_SET = new Set<string>(INTEREST_ROLES);

export type InterestLeadInput = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  role: InterestRole;
  businessName: string;
  notes: string | null;
  locale: Locale;
};

export type InterestParseResult =
  | { ok: true; data: InterestLeadInput }
  | { ok: false; reason: "spam" | "validation"; messageKey: InterestValidationKey };

export type InterestValidationKey =
  | "fullName"
  | "email"
  | "phone"
  | "country"
  | "city"
  | "role"
  | "businessName"
  | "notes";

export type InterestFormFields = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  role: string;
  businessName: string;
  notes: string;
  website: string;
  locale: string;
};

function clip(value: string, max: number): string {
  return value.trim().slice(0, max);
}

function digitCount(value: string): number {
  return (value.match(/\d/g) ?? []).length;
}

export function parseInterestForm(
  raw: Partial<InterestFormFields>,
): InterestParseResult {
  const website = String(raw.website ?? "").trim();
  if (website) {
    return { ok: false, reason: "spam", messageKey: "fullName" };
  }

  const fullName = clip(String(raw.fullName ?? ""), 120);
  const email = clip(String(raw.email ?? "").toLowerCase(), 200);
  const phone = clip(String(raw.phone ?? ""), 40);
  const country = clip(String(raw.country ?? ""), 80) || DEFAULT_INTEREST_COUNTRY;
  const city = clip(String(raw.city ?? ""), 80);
  const role = String(raw.role ?? "").trim();
  const businessName = clip(String(raw.businessName ?? ""), 160);
  const notesRaw = clip(String(raw.notes ?? ""), 2000);
  const locale = isLocale(raw.locale) ? raw.locale : DEFAULT_LOCALE;

  if (fullName.length < 2) {
    return { ok: false, reason: "validation", messageKey: "fullName" };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, reason: "validation", messageKey: "email" };
  }
  if (phone.length < 8 || digitCount(phone) < 8) {
    return { ok: false, reason: "validation", messageKey: "phone" };
  }
  if (country.length < 2) {
    return { ok: false, reason: "validation", messageKey: "country" };
  }
  if (city.length < 2) {
    return { ok: false, reason: "validation", messageKey: "city" };
  }
  if (!ROLE_SET.has(role)) {
    return { ok: false, reason: "validation", messageKey: "role" };
  }
  if (businessName.length < 2) {
    return { ok: false, reason: "validation", messageKey: "businessName" };
  }

  return {
    ok: true,
    data: {
      fullName,
      email,
      phone,
      country,
      city,
      role: role as InterestRole,
      businessName,
      notes: notesRaw.length > 0 ? notesRaw : null,
      locale,
    },
  };
}

export function interestFieldsFromFormData(formData: FormData): InterestFormFields {
  return {
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    country: String(formData.get("country") ?? ""),
    city: String(formData.get("city") ?? ""),
    role: String(formData.get("role") ?? ""),
    businessName: String(formData.get("businessName") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    website: String(formData.get("website") ?? ""),
    locale: String(formData.get("locale") ?? ""),
  };
}

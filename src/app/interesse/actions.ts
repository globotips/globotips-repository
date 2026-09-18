"use server";

import { after } from "next/server";
import { headers } from "next/headers";
import {
  interestFieldsFromFormData,
  parseInterestForm,
} from "@/lib/interest-lead";
import { notifyInterestLead } from "@/lib/interest-notify";
import { isInterestRateLimited } from "@/lib/interest-rate-limit";
import { prisma } from "@/lib/db";
import { getMessages } from "@/lib/i18n/messages";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/locales";

export type InterestFormState =
  | { ok: true }
  | { ok: false; error: "validation" | "rate" | "save"; message: string };

function clientKey(headerList: Headers, email: string) {
  const forwarded = headerList.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "unknown";
  return `${ip}:${email.toLowerCase()}`;
}

export async function submitInterestAction(
  _prev: InterestFormState | null,
  formData: FormData,
): Promise<InterestFormState> {
  const fields = interestFieldsFromFormData(formData);
  const locale = isLocale(fields.locale) ? fields.locale : DEFAULT_LOCALE;
  const copy = getMessages(locale).interest;
  const parsed = parseInterestForm(fields);

  if (!parsed.ok && parsed.reason === "spam") {
    return { ok: true };
  }
  if (!parsed.ok) {
    return {
      ok: false,
      error: "validation",
      message: copy.errors[parsed.messageKey],
    };
  }

  const headerList = await headers();
  if (isInterestRateLimited(clientKey(headerList, parsed.data.email))) {
    return { ok: false, error: "rate", message: copy.errors.rate };
  }

  const recentSameEmail = await prisma.interestLead.count({
    where: {
      email: parsed.data.email,
      createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) },
    },
  });
  if (recentSameEmail >= 5) {
    return { ok: false, error: "rate", message: copy.errors.rate };
  }

  try {
    await prisma.interestLead.create({
      data: {
        ...parsed.data,
        source: String(formData.get("source") ?? "interesse").slice(0, 80),
      },
    });
  } catch (error) {
    console.error("Interest lead save failed:", error);
    return { ok: false, error: "save", message: copy.errors.save };
  }

  after(() => {
    void notifyInterestLead(parsed.data).catch((error) => {
      console.warn("Interest lead notify failed:", error);
    });
  });

  return { ok: true };
}

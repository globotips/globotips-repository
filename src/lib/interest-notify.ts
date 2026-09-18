import type { InterestLeadInput } from "@/lib/interest-lead";

function notifyConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.INTEREST_NOTIFY_EMAIL);
}

export async function notifyInterestLead(lead: InterestLeadInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INTEREST_NOTIFY_EMAIL;
  if (!apiKey || !to) {
    return;
  }

  const from =
    process.env.INTEREST_NOTIFY_FROM ??
    "Travel Gratuity Group <onboarding@resend.dev>";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Brazil interest: ${lead.fullName} (${lead.role})`,
        text: [
          `${lead.fullName} registered interest.`,
          `Email: ${lead.email}`,
          `Phone: ${lead.phone}`,
          `Country: ${lead.country}`,
          `City: ${lead.city}`,
          `Role: ${lead.role}`,
          `Business: ${lead.businessName}`,
          `Locale: ${lead.locale}`,
          lead.notes ? `Notes: ${lead.notes}` : "Notes: (none)",
        ].join("\n"),
      }),
    });
    if (!response.ok) {
      console.warn("Interest lead email skipped:", response.status);
    }
  } catch (error) {
    console.warn("Interest lead email failed:", error);
  }
}

export function interestNotifyEnabled() {
  return notifyConfigured();
}

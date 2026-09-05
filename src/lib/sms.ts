import { GUEST_BRAND_NAME } from "@/lib/brand";

export type SmsSendResult = "sent" | "skipped" | "failed";

type EnvLike = Record<string, string | undefined>;

export function twilioConfigured(env: EnvLike = process.env): boolean {
  return Boolean(
    env.TWILIO_ACCOUNT_SID?.trim() &&
      env.TWILIO_AUTH_TOKEN?.trim() &&
      env.TWILIO_FROM_NUMBER?.trim(),
  );
}

export function staffInviteSmsBody(hotelName: string, joinUrl: string): string {
  return `${hotelName} invited you to receive guest tips with ${GUEST_BRAND_NAME}. Join: ${joinUrl}`;
}

export async function sendInviteSms(
  toE164: string,
  body: string,
  env: EnvLike = process.env,
): Promise<SmsSendResult> {
  const sid = env.TWILIO_ACCOUNT_SID?.trim();
  const token = env.TWILIO_AUTH_TOKEN?.trim();
  const from = env.TWILIO_FROM_NUMBER?.trim();
  if (!sid || !token || !from) {
    return "skipped";
  }

  try {
    const auth = Buffer.from(`${sid}:${token}`).toString("base64");
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: toE164,
          From: from,
          Body: body,
        }),
      },
    );
    if (!response.ok) {
      return "failed";
    }
    return "sent";
  } catch {
    return "failed";
  }
}

import { NextResponse } from "next/server";
import { resolveAppOrigin } from "@/lib/app-origin";
import {
  parseTipCheckoutAmount,
  resolveTipCheckoutRedirect,
  TIP_CHECKOUT_PAY_ERRORS,
} from "@/lib/tip-checkout";
import { startTipCheckoutSession } from "@/lib/tip-checkout-start";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function redirect303(url: string) {
  const response = NextResponse.redirect(url, 303);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: Request) {
  const origin = await resolveAppOrigin();
  let code = "";
  try {
    const formData = await request.formData();
    code = String(formData.get("code") ?? "").trim();
    const amountCents = parseTipCheckoutAmount(formData.get("amountCents"));
    const result = amountCents
      ? await startTipCheckoutSession(code, amountCents)
      : { ok: false as const, code: "amount" as const, error: TIP_CHECKOUT_PAY_ERRORS.amount };
    const redirect = resolveTipCheckoutRedirect(result, origin, code);
    return redirect303(redirect.url);
  } catch {
    const redirect = resolveTipCheckoutRedirect(
      { ok: false, code: "stripe", error: TIP_CHECKOUT_PAY_ERRORS.stripe },
      origin,
      code,
    );
    return redirect303(redirect.url);
  }
}

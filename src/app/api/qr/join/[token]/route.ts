import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getSessionHotel } from "@/lib/auth";
import { qrJoinUrl } from "@/lib/config";
import { prisma } from "@/lib/db";
import { canShowJoinQr, resolveInviteStatus } from "@/lib/invite";

export async function GET(
  request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const hotel = await getSessionHotel();
  if (!hotel) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { token } = await context.params;
  const employee = await prisma.employee.findFirst({
    where: { inviteToken: token, hotelId: hotel.id },
  });
  if (!employee) {
    return new NextResponse("Not found", { status: 404 });
  }

  const status = resolveInviteStatus(employee);
  if (!canShowJoinQr(status)) {
    return new NextResponse("Join QR is for Invited or Pending staff.", {
      status: 403,
    });
  }

  const png = await QRCode.toBuffer(qrJoinUrl(token), {
    type: "png",
    width: 640,
    margin: 2,
    errorCorrectionLevel: "M",
    color: {
      dark: "#083f36",
      light: "#fffdf8",
    },
  });

  const download = new URL(request.url).searchParams.get("download") === "1";
  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="join-${employee.tipCode}.png"`,
      "Cache-Control": "no-store",
    },
  });
}

import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getSessionHotel } from "@/lib/auth";
import { qrTipUrl } from "@/lib/config";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const hotel = await getSessionHotel();
  if (!hotel) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { code } = await context.params;
  const employee = await prisma.employee.findFirst({
    where: { tipCode: code, hotelId: hotel.id },
  });
  if (!employee) {
    return new NextResponse("Not found", { status: 404 });
  }

  const png = await QRCode.toBuffer(qrTipUrl(employee.tipCode), {
    type: "png",
    width: 640,
    margin: 2,
    errorCorrectionLevel: "M",
    color: {
      dark: "#083f36",
      light: "#fffdf8",
    },
  });

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="globotips-${employee.tipCode}.png"`,
      "Cache-Control": "no-store",
    },
  });
}

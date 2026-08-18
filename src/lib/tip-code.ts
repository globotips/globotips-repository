import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";

function slugFromName(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  return slug || "staff";
}

export async function createUniqueTipCode(name: string): Promise<string> {
  const base = slugFromName(name);
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const suffix = randomBytes(2).toString("hex");
    const tipCode = attempt === 0 ? base : `${base}-${suffix}`;
    const exists = await prisma.employee.findUnique({ where: { tipCode } });
    if (!exists) {
      return tipCode;
    }
  }
  return `${base}-${randomBytes(4).toString("hex")}`;
}

import { randomBytes } from "crypto";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_EMPLOYEES = [
  { name: "Maria Santos", tipCode: "maria-santos", phone: "+18135550101" },
  { name: "James Okonkwo", tipCode: "james-okonkwo", phone: "+18135550102" },
  { name: "Elena Rossi", tipCode: "elena-rossi", phone: "+18135550103" },
] as const;

function daysAgo(days: number, hour = 15): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 10, 0, 0);
  return date;
}

function inviteToken(): string {
  return randomBytes(24).toString("base64url");
}

async function main() {
  const email = (
    process.env.DEMO_HOTEL_EMAIL ?? "tampa@globotips.com"
  ).trim().toLowerCase();
  const password = process.env.DEMO_HOTEL_PASSWORD ?? "tampa-demo";
  const passwordHash = await hash(password, 12);

  const hotel = await prisma.hotel.upsert({
    where: { email },
    update: {
      name: "The Harbor Hotel, Tampa",
      passwordHash,
    },
    create: {
      name: "The Harbor Hotel, Tampa",
      email,
      passwordHash,
    },
  });

  const employees = [];
  for (const staff of DEMO_EMPLOYEES) {
    const existing = await prisma.employee.findUnique({
      where: { tipCode: staff.tipCode },
    });
    const employee = await prisma.employee.upsert({
      where: { tipCode: staff.tipCode },
      update: {
        name: staff.name,
        hotelId: hotel.id,
        phone: staff.phone,
        inviteToken: existing?.inviteToken ?? inviteToken(),
        inviteStatus: existing?.payoutsEnabled
          ? "active"
          : existing?.inviteStatus ?? "invited",
      },
      create: {
        hotelId: hotel.id,
        name: staff.name,
        phone: staff.phone,
        tipCode: staff.tipCode,
        inviteToken: inviteToken(),
        inviteStatus: "invited",
      },
    });
    employees.push(employee);
  }

  const existingTips = await prisma.tip.count({
    where: { employee: { hotelId: hotel.id } },
  });

  if (existingTips === 0) {
    const [maria, james, elena] = employees;
    await prisma.tip.createMany({
      data: [
        { employeeId: maria.id, amountCents: 1000, platformFeeCents: 30, createdAt: daysAgo(4, 11) },
        { employeeId: maria.id, amountCents: 500, platformFeeCents: 15, createdAt: daysAgo(3, 16) },
        { employeeId: maria.id, amountCents: 2000, platformFeeCents: 60, createdAt: daysAgo(1, 9) },
        { employeeId: james.id, amountCents: 2000, platformFeeCents: 60, createdAt: daysAgo(4, 14) },
        { employeeId: james.id, amountCents: 1000, platformFeeCents: 30, createdAt: daysAgo(2, 18) },
        { employeeId: james.id, amountCents: 500, platformFeeCents: 15, createdAt: daysAgo(0, 10) },
        { employeeId: elena.id, amountCents: 2000, platformFeeCents: 60, createdAt: daysAgo(3, 12) },
        { employeeId: elena.id, amountCents: 1000, platformFeeCents: 30, createdAt: daysAgo(1, 19) },
        { employeeId: elena.id, amountCents: 2000, platformFeeCents: 60, createdAt: daysAgo(0, 8) },
      ],
    });
  }

  console.log(`Seeded ${hotel.name}`);
  console.log(`Hotel login: ${email}`);
  console.log("Guest demo pages:");
  for (const staff of DEMO_EMPLOYEES) {
    console.log(`  /tip/${staff.tipCode}  (${staff.name})`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

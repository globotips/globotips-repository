import { notFound } from "next/navigation";
import { DemoBanner } from "@/components/demo-banner";
import { Logo } from "@/components/logo";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import { prisma } from "@/lib/db";
import { TipCheckout } from "./tip-checkout";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const employee = await prisma.employee.findUnique({
    where: { tipCode: code },
  });
  if (!employee) {
    return { title: "Tip page" };
  }
  return { title: `Tip ${employee.name}` };
}

export default async function TipPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const employee = await prisma.employee.findUnique({
    where: { tipCode: code },
    include: { hotel: true },
  });
  if (!employee) {
    notFound();
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col bg-paper">
      <DemoBanner compact />
      <header className="flex items-center justify-center px-5 py-4">
        <Logo markClassName="h-7 w-7" />
      </header>
      <main className="flex flex-1 flex-col px-5 pb-10">
        <div className="flex flex-col items-center pt-2">
          <PhotoPlaceholder name={employee.name} size={120} />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-teal">
            Tip
          </p>
          <h1 className="mt-1 text-center font-display text-3xl">
            {employee.name}
          </h1>
          <p className="mt-1 text-sm text-muted">{employee.hotel.name}</p>
        </div>
        <TipCheckout code={employee.tipCode} name={employee.name} />
      </main>
    </div>
  );
}

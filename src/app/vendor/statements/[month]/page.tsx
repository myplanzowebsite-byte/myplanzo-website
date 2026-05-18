import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { formatINR } from "@/lib/format";
import { PrintButton } from "@/components/vendor/PrintButton";

const COMMISSION_RATE = 0.15;
const DATE_FMT = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" });
const MONTH_FMT = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" });

export const dynamic = "force-dynamic";

export default async function StatementPage({
  params,
}: {
  params: Promise<{ month: string }>;
}) {
  const session = await readSession();
  const { month } = await params;
  if (!session || session.role !== "VENDOR") {
    redirect(`/login?next=/vendor/statements/${month}`);
  }
  if (!/^\d{4}-\d{2}$/.test(month)) notFound();

  const vendor = await prisma.vendorProfile.findUnique({ where: { userId: session.sub } });
  if (!vendor) redirect("/vendor");

  const [y, m] = month.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 1));

  const payments = await prisma.payment.findMany({
    where: {
      status: "CAPTURED",
      createdAt: { gte: start, lt: end },
      booking: { vendorId: vendor.id },
    },
    include: { booking: { include: { listing: { select: { title: true } } } } },
    orderBy: { createdAt: "asc" },
  });

  const commissionOf = (amt: number, c: number) => c || Math.round(amt * COMMISSION_RATE);
  const gross = payments.reduce((s, p) => s + p.amountPaise, 0);
  const commission = payments.reduce((s, p) => s + commissionOf(p.amountPaise, p.commissionPaise), 0);
  const net = gross - commission;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <Link href="/vendor" className="text-sm underline">
          ← Dashboard
        </Link>
        <PrintButton />
      </div>

      <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-8 shadow-[var(--shadow-mp-card)] print:shadow-none">
        <div className="flex items-start justify-between border-b border-mp-border pb-4">
          <div>
            <p className="text-lg font-semibold text-mp-charcoal">MyPlanzo</p>
            <p className="text-sm text-mp-muted">Payout statement</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-medium text-mp-charcoal">{vendor.businessName}</p>
            <p className="text-mp-muted">{MONTH_FMT.format(start)}</p>
          </div>
        </div>

        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-mp-border text-left text-xs text-mp-muted">
              <th className="py-2">Date</th>
              <th className="py-2">Booking</th>
              <th className="py-2 text-right">Gross</th>
              <th className="py-2 text-right">Commission</th>
              <th className="py-2 text-right">Net</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => {
              const c = commissionOf(p.amountPaise, p.commissionPaise);
              return (
                <tr key={p.id} className="border-b border-mp-border/60">
                  <td className="py-2 text-mp-muted">{DATE_FMT.format(p.createdAt)}</td>
                  <td className="py-2 text-mp-charcoal">
                    {p.booking.listing?.title ?? "Booking"}
                  </td>
                  <td className="py-2 text-right">{formatINR(p.amountPaise / 100)}</td>
                  <td className="py-2 text-right text-mp-muted">
                    - {formatINR(c / 100)}
                  </td>
                  <td className="py-2 text-right font-medium">
                    {formatINR((p.amountPaise - c) / 100)}
                  </td>
                </tr>
              );
            })}
            {payments.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-mp-muted">
                  No settled payments this month.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-4 space-y-1 border-t border-mp-border pt-4 text-sm">
          <div className="flex justify-between text-mp-muted">
            <span>Gross</span>
            <span>{formatINR(gross / 100)}</span>
          </div>
          <div className="flex justify-between text-mp-muted">
            <span>Platform commission (15%)</span>
            <span>- {formatINR(commission / 100)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-mp-charcoal">
            <span>Net payout</span>
            <span>{formatINR(net / 100)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

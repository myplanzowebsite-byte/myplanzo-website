import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";

export default async function AdminCommissionsPage() {
  const payments = await prisma.payment.findMany({
    where: { status: "CAPTURED" },
    include: { booking: { include: { vendor: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const totals = await prisma.payment.aggregate({
    where: { status: "CAPTURED" },
    _sum: { amountPaise: true, commissionPaise: true },
  });

  return (
    <>
      <AdminHeader title="Commissions and Payouts" breadcrumbs={["Commissions"]} />
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)] text-sm">
          <p className="text-mp-muted">Gross captured</p>
          <p className="text-xl font-semibold">
            ₹{((totals._sum.amountPaise ?? 0) / 100).toFixed(2)}
          </p>
        </div>
        <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)] text-sm">
          <p className="text-mp-muted">Platform commission (15%)</p>
          <p className="text-xl font-semibold">
            ₹{((totals._sum.commissionPaise ?? 0) / 100).toFixed(2)}
          </p>
        </div>
      </div>
      <div className="overflow-hidden rounded-[var(--radius-mp-card)] bg-mp-card shadow-[var(--shadow-mp-card)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-mp-border bg-mp-panel/40 text-mp-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Vendor</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Commission</th>
              <th className="px-4 py-3 font-medium">Order</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-mp-border/80">
                <td className="px-4 py-3">{p.booking.vendor.businessName}</td>
                <td className="px-4 py-3">₹{(p.amountPaise / 100).toFixed(2)}</td>
                <td className="px-4 py-3">₹{(p.commissionPaise / 100).toFixed(2)}</td>
                <td className="px-4 py-3 text-xs text-mp-muted">{p.razorpayOrderId}</td>
              </tr>
            ))}
            {payments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-mp-muted">
                  No captured payments yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}

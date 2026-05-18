import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";

const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;

function inr(paise: number) {
  return `₹${Math.round(paise / 100).toLocaleString("en-IN")}`;
}

function StatCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-[var(--radius-mp-card)] border border-mp-border bg-mp-card p-5 shadow-[var(--shadow-mp-card)]">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-mp-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-mp-charcoal">{value}</p>
      {note && <p className="mt-1 text-xs text-mp-muted">{note}</p>}
    </div>
  );
}

function Bars({ rows }: { rows: { label: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.label} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-mp-charcoal">{r.label}</span>
            <span className="text-mp-muted">{r.value}</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-mp-panel">
            <div
              className="h-2.5 rounded-full bg-mp-accent"
              style={{ width: `${(r.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
      {rows.length === 0 && <p className="text-sm text-mp-muted">No data yet.</p>}
    </div>
  );
}

export default async function AdminReportsPage() {
  const since30 = new Date(Date.now() - 30 * 86_400_000);

  const [
    customers,
    vendors,
    newCustomers,
    newVendors,
    bookingsByStatus,
    revenue,
    topVendors,
    bookingsForCategory,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER", deletedAt: null } }),
    prisma.user.count({ where: { role: "VENDOR" } }),
    prisma.user.count({ where: { role: "CUSTOMER", deletedAt: null, createdAt: { gte: since30 } } }),
    prisma.user.count({ where: { role: "VENDOR", createdAt: { gte: since30 } } }),
    prisma.booking.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.payment.aggregate({
      where: { status: "CAPTURED" },
      _sum: { amountPaise: true, commissionPaise: true },
    }),
    prisma.vendorProfile.findMany({
      take: 5,
      orderBy: { bookings: { _count: "desc" } },
      include: { _count: { select: { bookings: true } } },
    }),
    prisma.booking.findMany({ select: { listing: { select: { category: true } } } }),
  ]);

  const statusCount = (s: string) =>
    bookingsByStatus.find((b) => b.status === s)?._count._all ?? 0;
  const totalBookings = bookingsByStatus.reduce((s, b) => s + b._count._all, 0);

  const grossPaise = revenue._sum.amountPaise ?? 0;
  const commissionPaise = revenue._sum.commissionPaise ?? 0;

  const categoryTally = new Map<string, number>();
  for (const b of bookingsForCategory) {
    const c = b.listing?.category || "Uncategorised";
    categoryTally.set(c, (categoryTally.get(c) ?? 0) + 1);
  }
  const categoryRows = [...categoryTally.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <>
      <AdminHeader
        title="Reports & Analytics"
        breadcrumbs={["Reports"]}
        subtitle="Registration, bookings, revenue and engagement"
      />
      <div className="space-y-6">
        {/* Registration */}
        <section>
          <h2 className="mb-3 text-sm font-medium text-mp-muted">Registrations</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Customers" value={customers.toLocaleString()} note={`+${newCustomers} in 30 days`} />
            <StatCard label="Vendors" value={vendors.toLocaleString()} note={`+${newVendors} in 30 days`} />
            <StatCard label="Total bookings" value={totalBookings.toLocaleString()} />
            <StatCard
              label="Cancelled"
              value={statusCount("CANCELLED").toLocaleString()}
              note={
                totalBookings
                  ? `${Math.round((statusCount("CANCELLED") / totalBookings) * 100)}% of bookings`
                  : undefined
              }
            />
          </div>
        </section>

        {/* Revenue */}
        <section>
          <h2 className="mb-3 text-sm font-medium text-mp-muted">Revenue</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Gross booking value" value={inr(grossPaise)} note="Captured payments" />
            <StatCard label="Commission earned" value={inr(commissionPaise)} note="Platform 15%" />
            <StatCard label="Vendor payouts" value={inr(grossPaise - commissionPaise)} note="Net to vendors" />
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Bookings by status */}
          <section className="rounded-[var(--radius-mp-card)] border border-mp-border bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
            <h3 className="mb-4 text-sm font-semibold text-mp-charcoal">Bookings by status</h3>
            <Bars
              rows={BOOKING_STATUSES.map((s) => ({
                label: s[0] + s.slice(1).toLowerCase(),
                value: statusCount(s),
              }))}
            />
          </section>

          {/* Bookings by category */}
          <section className="rounded-[var(--radius-mp-card)] border border-mp-border bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
            <h3 className="mb-4 text-sm font-semibold text-mp-charcoal">Most-booked categories</h3>
            <Bars rows={categoryRows} />
          </section>
        </div>

        {/* Top vendors */}
        <section className="rounded-[var(--radius-mp-card)] border border-mp-border bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
          <h3 className="mb-4 text-sm font-semibold text-mp-charcoal">Top vendors by bookings</h3>
          <Bars
            rows={topVendors.map((v) => ({ label: v.businessName, value: v._count.bookings }))}
          />
        </section>
      </div>
    </>
  );
}

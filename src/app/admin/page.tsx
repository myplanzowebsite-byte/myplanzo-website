import Link from "next/link";
import { ArrowUpRight, BadgeCheck, CalendarDays, Clock3, Store, Users, Wallet } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [customers, vendors, activeListings, bookings, pendingVendors, payments, recentBookings] =
    await Promise.all([
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.user.count({ where: { role: "VENDOR" } }),
      prisma.serviceListing.count({ where: { status: "ACTIVE" } }),
      prisma.booking.count(),
      prisma.vendorProfile.count({ where: { verificationStatus: "PENDING" } }),
      prisma.payment.aggregate({ _sum: { amountPaise: true } }),
      prisma.booking.findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          createdAt: true,
          customer: { select: { email: true } },
          vendor: { select: { businessName: true } },
        },
      }),
    ]);

  const revenue = (payments._sum.amountPaise ?? 0) / 100;
  const listingCoverage = vendors ? Math.min(100, Math.round((activeListings / vendors) * 100)) : 0;
  const reviewLoad = vendors ? Math.min(100, Math.round((pendingVendors / vendors) * 100)) : 0;

  const metrics = [
    {
      label: "Customers",
      value: customers.toLocaleString(),
      note: "Active marketplace users",
      icon: Users,
    },
    {
      label: "Vendors",
      value: vendors.toLocaleString(),
      note: `${pendingVendors} awaiting review`,
      icon: Store,
    },
    {
      label: "Bookings",
      value: bookings.toLocaleString(),
      note: "Across all event types",
      icon: CalendarDays,
    },
    {
      label: "Gross payments",
      value: `₹${revenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      note: "Captured and pending totals",
      icon: Wallet,
    },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" subtitle="Marketplace health, approvals, and activity at a glance" />
      <section className="space-y-6">
        <div>
          <h2 className="mb-3 text-sm font-medium text-mp-muted">Platform snapshot</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-[var(--radius-mp-card)] border border-mp-border bg-mp-card p-5 shadow-[var(--shadow-mp-card)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-mp-muted">{item.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-mp-charcoal">{item.value}</p>
                    </div>
                    <span className="rounded-xl bg-mp-accent-soft p-2 text-mp-accent">
                      <Icon className="size-4.5" />
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-mp-muted">{item.note}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[var(--radius-mp-card)] border border-mp-border bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mp-accent">Operations overview</p>
                <h3 className="mt-1 text-lg font-semibold text-mp-charcoal">Approval and listing momentum</h3>
              </div>
              <Link
                href="/admin/users/professionals"
                className="inline-flex items-center gap-1 text-sm font-medium text-mp-accent hover:text-mp-charcoal"
              >
                Review professionals <ArrowUpRight className="size-4" />
              </Link>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm text-mp-charcoal">
                  <span>Active listings coverage</span>
                  <span className="font-medium">{listingCoverage}%</span>
                </div>
                <div className="h-2 rounded-full bg-mp-panel">
                  <div className="h-2 rounded-full bg-mp-accent" style={{ width: `${listingCoverage}%` }} />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm text-mp-charcoal">
                  <span>Vendor review queue</span>
                  <span className="font-medium">{pendingVendors} pending</span>
                </div>
                <div className="h-2 rounded-full bg-mp-panel">
                  <div className="h-2 rounded-full bg-mp-charcoal" style={{ width: `${reviewLoad}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-mp-panel p-4">
                <p className="text-xs text-mp-muted">Live listings</p>
                <p className="mt-1 text-xl font-semibold text-mp-charcoal">{activeListings}</p>
              </div>
              <div className="rounded-2xl bg-mp-panel p-4">
                <p className="text-xs text-mp-muted">Pending reviews</p>
                <p className="mt-1 text-xl font-semibold text-mp-charcoal">{pendingVendors}</p>
              </div>
              <div className="rounded-2xl bg-mp-panel p-4">
                <p className="text-xs text-mp-muted">Revenue tracked</p>
                <p className="mt-1 text-xl font-semibold text-mp-charcoal">₹{revenue.toFixed(0)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[var(--radius-mp-card)] border border-mp-border bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mp-accent">Quick actions</p>
              <div className="mt-4 space-y-2">
                {[
                  { href: "/admin/bookings", label: "Manage bookings" },
                  { href: "/admin/users/customers", label: "Review customer accounts" },
                  { href: "/admin/subadmins/new", label: "Create subadmin" },
                  { href: "/admin/cms", label: "Update CMS content" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-xl border border-mp-border bg-mp-panel px-3 py-2.5 text-sm font-medium text-mp-charcoal transition-colors hover:border-mp-accent/40 hover:bg-mp-soft-blue"
                  >
                    {item.label}
                    <ArrowUpRight className="size-4 text-mp-accent" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[var(--radius-mp-card)] border border-mp-border bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
              <div className="flex items-center gap-2 text-mp-accent">
                <BadgeCheck className="size-4" />
                <p className="text-sm font-semibold text-mp-charcoal">Approval focus</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-mp-muted">
                {pendingVendors > 0
                  ? `${pendingVendors} vendor profile${pendingVendors === 1 ? " is" : "s are"} waiting for review. Prioritize approvals to keep listing momentum high.`
                  : "No vendor approvals are waiting right now. The review queue is clear."}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[var(--radius-mp-card)] border border-mp-border bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
          <div className="mb-4 flex items-center gap-2">
            <Clock3 className="size-4 text-mp-accent" />
            <h3 className="text-sm font-semibold text-mp-charcoal">Recent booking activity</h3>
          </div>

          <div className="space-y-3">
            {recentBookings.length === 0 ? (
              <p className="text-sm text-mp-muted">No booking activity yet.</p>
            ) : (
              recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col gap-2 rounded-2xl border border-mp-border bg-mp-panel px-4 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-mp-charcoal">{booking.customer.email}</p>
                    <p className="text-xs text-mp-muted">{booking.vendor.businessName}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="rounded-full bg-mp-accent-soft px-2.5 py-1 font-medium text-mp-accent">
                      {booking.status}
                    </span>
                    <span className="text-mp-muted">{new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}

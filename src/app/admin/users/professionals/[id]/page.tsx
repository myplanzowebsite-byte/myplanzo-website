import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";
import { VendorVerifyButtons } from "@/components/admin/VendorVerifyButtons";

const DATE_FMT = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });
const inr = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

export default async function AdminProfessionalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findFirst({
    where: { id, role: "VENDOR" },
    include: {
      vendorProfile: {
        include: {
          listings: true,
          bookings: {
            include: { payments: true, disputes: true, customer: { select: { email: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });
  if (!user?.vendorProfile) notFound();
  const v = user.vendorProfile;

  const captured = v.bookings.flatMap((b) => b.payments).filter((p) => p.status === "CAPTURED");
  const gross = captured.reduce((s, p) => s + p.amountPaise, 0);
  const commission = captured.reduce((s, p) => s + p.commissionPaise, 0);
  const disputes = v.bookings.flatMap((b) =>
    b.disputes.map((d) => ({ ...d, customerEmail: b.customer.email })),
  );

  return (
    <>
      <AdminHeader
        title={v.businessName}
        breadcrumbs={["Manage Users", "Professionals", "View"]}
        subtitle={user.email}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 rounded-[var(--radius-mp-card)] bg-mp-card p-5 text-sm shadow-[var(--shadow-mp-card)]">
          <div>
            <p className="text-xs text-mp-muted">Phone</p>
            <p className="font-medium">{user.phone}</p>
          </div>
          <div>
            <p className="text-xs text-mp-muted">Verification</p>
            <p className="font-medium">{v.verificationStatus}</p>
          </div>
          <div>
            <p className="text-xs text-mp-muted">Profile views</p>
            <p className="font-medium">{v.profileViews}</p>
          </div>
          <VendorVerifyButtons vendorUserId={user.id} status={v.verificationStatus} />
          <Link
            href="/admin/users/professionals"
            className="block text-sm text-mp-charcoal underline"
          >
            ← Back to list
          </Link>
        </div>

        <div className="space-y-4 lg:col-span-2">
          {/* Earnings */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)]">
              <p className="text-xs text-mp-muted">Gross earnings</p>
              <p className="mt-1 text-lg font-semibold text-mp-charcoal">{inr(gross)}</p>
            </div>
            <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)]">
              <p className="text-xs text-mp-muted">Commission</p>
              <p className="mt-1 text-lg font-semibold text-mp-charcoal">{inr(commission)}</p>
            </div>
            <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)]">
              <p className="text-xs text-mp-muted">Net payout</p>
              <p className="mt-1 text-lg font-semibold text-mp-accent">{inr(gross - commission)}</p>
            </div>
          </div>

          <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-5 shadow-[var(--shadow-mp-card)]">
            <h3 className="text-sm font-semibold text-mp-charcoal">Listings ({v.listings.length})</h3>
            <ul className="mt-2 space-y-1 text-sm text-mp-muted">
              {v.listings.map((l) => (
                <li key={l.id}>
                  {l.title} — {l.status}
                </li>
              ))}
              {v.listings.length === 0 && <li>No listings</li>}
            </ul>
          </div>

          <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-5 shadow-[var(--shadow-mp-card)]">
            <h3 className="mb-3 text-sm font-semibold text-mp-charcoal">
              Booking history ({v.bookings.length})
            </h3>
            <ul className="space-y-2 text-sm">
              {v.bookings.map((b) => (
                <li key={b.id} className="flex justify-between border-b border-mp-border/60 py-2">
                  <span>{b.customer.email}</span>
                  <span className="text-mp-muted">
                    {DATE_FMT.format(b.createdAt)} · {b.status}
                  </span>
                </li>
              ))}
              {v.bookings.length === 0 && <li className="text-mp-muted">No bookings</li>}
            </ul>
          </div>

          <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-5 shadow-[var(--shadow-mp-card)]">
            <h3 className="mb-3 text-sm font-semibold text-mp-charcoal">
              Dispute log ({disputes.length})
            </h3>
            <ul className="space-y-2 text-sm">
              {disputes.map((d) => (
                <li key={d.id} className="border-b border-mp-border/60 py-2">
                  <p className="flex justify-between">
                    <span>{d.customerEmail}</span>
                    <span className="text-mp-muted">{d.status}</span>
                  </p>
                  <p className="text-xs text-mp-muted">{d.reason}</p>
                </li>
              ))}
              {disputes.length === 0 && <li className="text-mp-muted">No disputes</li>}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function VendorDashboardPage() {
  const session = await readSession();
  if (!session || session.role !== "VENDOR") redirect("/");
  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: session.sub },
    include: { listings: true, bookings: true },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-mp-charcoal">Vendor dashboard</h1>
      {vendor?.verificationStatus !== "ACTIVE" ? (
        <p className="rounded-md border border-mp-border bg-mp-warm px-3 py-2 text-sm text-mp-charcoal">
          Your profile is <strong>{vendor?.verificationStatus ?? "unknown"}</strong>. An admin must approve
          before listings appear publicly.
        </p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)]">
          <p className="text-xs text-mp-muted">Listings</p>
          <p className="text-2xl font-semibold">{vendor?.listings.length ?? 0}</p>
        </div>
        <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)]">
          <p className="text-xs text-mp-muted">Bookings</p>
          <p className="text-2xl font-semibold">{vendor?.bookings.length ?? 0}</p>
        </div>
        <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)] flex items-center">
          <Link href="/vendor/listings" className="text-sm font-medium text-mp-charcoal underline">
            Manage listings →
          </Link>
        </div>
      </div>
    </div>
  );
}

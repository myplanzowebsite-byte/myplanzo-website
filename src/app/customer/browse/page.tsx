import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CustomerBrowsePage() {
  const listings = await prisma.serviceListing.findMany({
    where: { status: "ACTIVE", vendor: { verificationStatus: "ACTIVE" } },
    include: { vendor: true },
    orderBy: { updatedAt: "desc" },
    take: 40,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-mp-charcoal">Browse</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {listings.map((l) => (
          <Link
            key={l.id}
            href={`/customer/listings/${l.id}`}
            className="rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)] hover:ring-2 ring-mp-charcoal/10"
          >
            <p className="font-medium text-mp-charcoal">{l.title}</p>
            <p className="text-xs text-mp-muted mt-1">{l.vendor.businessName}</p>
            <p className="text-sm text-mp-muted mt-2 line-clamp-2">{l.description}</p>
          </Link>
        ))}
        {listings.length === 0 ? (
          <p className="text-mp-muted text-sm">No active listings yet.</p>
        ) : null}
      </div>
    </div>
  );
}

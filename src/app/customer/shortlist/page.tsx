import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function CustomerShortlistPage() {
  const session = await readSession();
  if (!session || session.role !== "CUSTOMER") redirect("/login");

  const items = await prisma.shortlistEntry.findMany({
    where: { userId: session.sub },
    include: { listing: { include: { vendor: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-mp-charcoal">Shortlist</h1>
      <ul className="space-y-3">
        {items.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)]"
          >
            <div>
              <p className="font-medium">{s.listing.title}</p>
              <p className="text-xs text-mp-muted">{s.listing.vendor.businessName}</p>
            </div>
            <Link
              href={`/customer/listings/${s.listingId}`}
              className="text-sm font-medium text-mp-charcoal underline"
            >
              Open
            </Link>
          </li>
        ))}
        {items.length === 0 ? <p className="text-mp-muted text-sm">Nothing shortlisted yet.</p> : null}
      </ul>
    </div>
  );
}

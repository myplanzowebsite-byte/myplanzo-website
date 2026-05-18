import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { formatINR } from "@/lib/format";
import { MOCK_LISTINGS } from "@/lib/mockListings";
import { DiscoverStack, type DiscoverCard } from "@/components/customer/DiscoverStack";

export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const session = await readSession();
  if (!session || session.role !== "CUSTOMER") redirect("/login?next=/customer/discover");

  const listings = await prisma.serviceListing.findMany({
    where: { status: "ACTIVE", vendor: { verificationStatus: "ACTIVE" } },
    include: { vendor: { select: { businessName: true } } },
    orderBy: { updatedAt: "desc" },
    take: 30,
  });

  const dbCards: DiscoverCard[] = listings.map((l) => ({
    id: l.id,
    name: l.title,
    subtitle: l.category ?? l.vendor.businessName,
    img: l.photos?.[0] ?? null,
    price: l.priceMin ? formatINR(l.priceMin) : "Contact for pricing",
    href: `/listings/${l.id}`,
  }));

  const mockCards: DiscoverCard[] = MOCK_LISTINGS.map((m) => ({
    id: m.id,
    name: m.title,
    subtitle: m.category,
    img: m.photos[0] ?? null,
    price: formatINR(m.priceMin),
    href: `/listings/${m.id}`,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-mp-charcoal">Discover</h1>
        <p className="text-sm text-mp-muted mt-1">
          Swipe through vendors — pass or shortlist.
        </p>
      </div>
      <DiscoverStack cards={[...dbCards, ...mockCards]} />
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ShortlistButton } from "@/components/customer/ShortlistButton";
import { BookingRequestForm } from "@/components/customer/BookingRequestForm";

export default async function CustomerListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await prisma.serviceListing.findFirst({
    where: { id, status: "ACTIVE", vendor: { verificationStatus: "ACTIVE" } },
    include: { vendor: true },
  });
  if (!listing) notFound();

  return (
    <div className="space-y-6">
      <Link href="/customer/browse" className="text-sm text-mp-charcoal underline">
        ← Back
      </Link>
      <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)] space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-mp-charcoal">{listing.title}</h1>
            <p className="text-sm text-mp-muted mt-1">{listing.vendor.businessName}</p>
          </div>
          <ShortlistButton listingId={listing.id} />
        </div>
        <p className="text-sm text-mp-charcoal whitespace-pre-wrap">{listing.description}</p>
        <BookingRequestForm listingId={listing.id} />
      </div>
    </div>
  );
}

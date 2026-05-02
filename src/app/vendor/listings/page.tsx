import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { VendorListingForm } from "@/components/vendor/VendorListingForm";

export default async function VendorListingsPage() {
  const session = await readSession();
  if (!session || session.role !== "VENDOR") redirect("/login");
  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: session.sub },
    include: { listings: { orderBy: { updatedAt: "desc" } } },
  });
  if (!vendor) redirect("/login");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-mp-charcoal">Service listings</h1>
      <VendorListingForm />
      <ul className="space-y-2">
        {vendor.listings.map((l) => (
          <li
            key={l.id}
            className="rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)] text-sm flex justify-between gap-2"
          >
            <div>
              <p className="font-medium">{l.title}</p>
              <p className="text-mp-muted text-xs mt-1">{l.status}</p>
            </div>
          </li>
        ))}
        {vendor.listings.length === 0 ? <p className="text-mp-muted text-sm">No listings yet.</p> : null}
      </ul>
    </div>
  );
}

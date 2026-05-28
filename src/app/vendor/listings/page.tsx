import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { VendorListingForm } from "@/components/vendor/VendorListingForm";
import { VendorListingEditRow } from "@/components/vendor/VendorListingEditRow";
import { getVendorCategories } from "@/lib/vendorCategories";

export default async function VendorListingsPage() {
  const session = await readSession();
  if (!session || session.role !== "VENDOR") redirect("/login");
  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: session.sub },
    include: { listings: { orderBy: { updatedAt: "desc" } } },
  });
  if (!vendor) redirect("/login");

  const vendorCategories = await getVendorCategories();

  const active = vendor.listings.filter((l) => l.status === "ACTIVE");
  const drafts = vendor.listings.filter((l) => l.status === "DRAFT");
  const archived = vendor.listings.filter((l) => l.status === "ARCHIVED");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-mp-charcoal">Service listings</h1>
        <p className="text-sm text-mp-muted mt-1">
          Manage what customers see. Draft listings are hidden until you publish them.
        </p>
      </div>

      <VendorListingForm vendorCategories={vendorCategories} />

      {vendor.listings.length === 0 ? (
        <p className="text-mp-muted text-sm">No listings yet — create your first one above.</p>
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-mp-muted">
                Active ({active.length})
              </h2>
              <ul className="space-y-2">
                {active.map((l) => (
                  <VendorListingEditRow key={l.id} listing={l} vendorCategories={vendorCategories} />
                ))}
              </ul>
            </section>
          )}

          {drafts.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-mp-muted">
                Drafts ({drafts.length})
              </h2>
              <ul className="space-y-2">
                {drafts.map((l) => (
                  <VendorListingEditRow key={l.id} listing={l} vendorCategories={vendorCategories} />
                ))}
              </ul>
            </section>
          )}

          {archived.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-mp-muted">
                Archived ({archived.length})
              </h2>
              <ul className="space-y-2">
                {archived.map((l) => (
                  <VendorListingEditRow key={l.id} listing={l} vendorCategories={vendorCategories} />
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

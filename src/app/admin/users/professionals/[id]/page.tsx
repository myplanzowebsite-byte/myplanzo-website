import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";
import { VendorVerifyButtons } from "@/components/admin/VendorVerifyButtons";

export default async function AdminProfessionalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findFirst({
    where: { id, role: "VENDOR" },
    include: {
      vendorProfile: { include: { listings: true, bookings: true } },
    },
  });
  if (!user?.vendorProfile) notFound();
  const v = user.vendorProfile;

  return (
    <>
      <AdminHeader
        title={v.businessName}
        breadcrumbs={["Manage Users", "Professionals", "View"]}
        subtitle={user.email}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-5 shadow-[var(--shadow-mp-card)] space-y-3 text-sm lg:col-span-1">
          <div>
            <p className="text-mp-muted text-xs">Phone</p>
            <p className="font-medium">{user.phone}</p>
          </div>
          <div>
            <p className="text-mp-muted text-xs">Verification</p>
            <p className="font-medium">{v.verificationStatus}</p>
          </div>
          <VendorVerifyButtons vendorUserId={user.id} status={v.verificationStatus} />
          <Link href="/admin/users/professionals" className="text-sm text-mp-charcoal underline">
            ← Back to list
          </Link>
        </div>
        <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-5 shadow-[var(--shadow-mp-card)] lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-mp-charcoal">Listings</h3>
            <ul className="mt-2 space-y-1 text-sm text-mp-muted">
              {v.listings.map((l) => (
                <li key={l.id}>
                  {l.title} — {l.status}
                </li>
              ))}
              {v.listings.length === 0 ? <li>No listings</li> : null}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-mp-charcoal">Bookings</h3>
            <p className="text-sm text-mp-muted mt-1">{v.bookings.length} total</p>
          </div>
        </div>
      </div>
    </>
  );
}

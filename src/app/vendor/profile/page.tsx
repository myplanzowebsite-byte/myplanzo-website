import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { VendorProfileForm } from "./VendorProfileForm";
import { AvailabilityManager } from "./AvailabilityManager";
import { PayoutSettings } from "./PayoutSettings";
import { VendorSecuritySettings } from "./SecuritySettings";
import { VendorDangerZone } from "./DangerZone";
import { getVendorCategories } from "@/lib/vendorCategories";

export const dynamic = "force-dynamic";

export default async function VendorProfilePage() {
  const session = await readSession();
  if (!session || session.role !== "VENDOR") redirect("/login?next=/vendor/profile");

  const profile = await prisma.vendorProfile.findUnique({ where: { userId: session.sub } });
  if (!profile) redirect("/vendor");

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { email: true, phone: true },
  });

  const vendorCategories = await getVendorCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-mp-charcoal">Business profile</h1>
        <p className="text-sm text-mp-muted mt-1">
          This is what customers see. Verification status:{" "}
          <strong>{profile.verificationStatus}</strong>
        </p>
      </div>

      <VendorProfileForm
        initial={{
          businessName: profile.businessName,
          description: profile.description ?? "",
          location: profile.location ?? "",
          photoUrl: profile.photoUrl ?? "",
          coverImageUrl: profile.coverImageUrl ?? "",
          categories: profile.categories,
          contactPreference: profile.contactPreference ?? "",
          portfolioUrls: profile.portfolioUrls,
        }}
        vendorCategories={vendorCategories}
      />

      <AvailabilityManager />

      <PayoutSettings
        initial={{
          payoutUpiId: profile.payoutUpiId ?? "",
          payoutRazorpayLink: profile.payoutRazorpayLink ?? "",
        }}
      />

      {user && (
        <VendorSecuritySettings currentPhone={user.phone ?? ""} currentEmail={user.email} />
      )}

      <VendorDangerZone />
    </div>
  );
}

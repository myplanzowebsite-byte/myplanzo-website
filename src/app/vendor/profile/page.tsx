import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { VendorProfileForm } from "./VendorProfileForm";
import { AvailabilityManager } from "./AvailabilityManager";

export const dynamic = "force-dynamic";

export default async function VendorProfilePage() {
  const session = await readSession();
  if (!session || session.role !== "VENDOR") redirect("/login?next=/vendor/profile");

  const profile = await prisma.vendorProfile.findUnique({ where: { userId: session.sub } });
  if (!profile) redirect("/vendor");

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
      />

      <AvailabilityManager />
    </div>
  );
}

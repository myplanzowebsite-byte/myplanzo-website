import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { ProfileForm } from "./ProfileForm";
import { NotificationPrefsForm } from "./NotificationPrefsForm";
import { SecuritySettings } from "./SecuritySettings";
import { DangerZone } from "./DangerZone";

export const dynamic = "force-dynamic";

export default async function CustomerProfilePage() {
  const session = await readSession();
  if (!session || session.role !== "CUSTOMER") redirect("/login?next=/customer/profile");

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { email: true, phone: true, customerProfile: true },
  });
  if (!user) redirect("/login");

  const prefs = (user.customerProfile?.preferences ?? {}) as {
    eventType?: string;
    location?: string;
    budgetRange?: string;
    categories?: string[];
  };
  const np = (user.customerProfile?.notificationPrefs ?? {}) as Record<string, boolean>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-mp-charcoal">Profile &amp; Settings</h1>
        <p className="text-sm text-mp-muted mt-1">Manage your details, preferences and account.</p>
      </div>

      <ProfileForm
        email={user.email}
        phone={user.phone}
        initial={{
          displayName: user.customerProfile?.displayName ?? "",
          photoUrl: user.customerProfile?.photoUrl ?? "",
          eventType: prefs.eventType ?? "",
          location: prefs.location ?? "",
          budgetRange: prefs.budgetRange ?? "",
          categories: prefs.categories ?? [],
        }}
      />

      <NotificationPrefsForm
        initial={{
          bookingUpdates: np.bookingUpdates ?? true,
          quotes: np.quotes ?? true,
          messages: np.messages ?? true,
        }}
      />

      <SecuritySettings currentPhone={user.phone} />

      <DangerZone />
    </div>
  );
}

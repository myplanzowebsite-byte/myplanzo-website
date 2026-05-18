import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth/session";
import { NotificationsView } from "@/components/NotificationsView";

export const dynamic = "force-dynamic";

export default async function VendorNotificationsPage() {
  const session = await readSession();
  if (!session || session.role !== "VENDOR") {
    redirect("/login?next=/vendor/notifications");
  }
  return <NotificationsView />;
}

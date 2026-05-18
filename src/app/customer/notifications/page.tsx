import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth/session";
import { NotificationsView } from "@/components/NotificationsView";

export const dynamic = "force-dynamic";

export default async function CustomerNotificationsPage() {
  const session = await readSession();
  if (!session || session.role !== "CUSTOMER") {
    redirect("/login?next=/customer/notifications");
  }
  return <NotificationsView />;
}

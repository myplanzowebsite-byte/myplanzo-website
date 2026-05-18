import { readSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "./SiteHeader";

// Role-aware site header. Reads the session server-side and renders the nav
// set for the logged-in role, so a customer always sees the customer header
// and a vendor always sees the vendor header — on every page.
export async function AppHeader() {
  const session = await readSession();

  if (!session) {
    return <SiteHeader isLoggedIn={false} />;
  }

  const unread = await prisma.notification.count({
    where: { userId: session.sub, readAt: null },
  });

  const navLinks =
    session.role === "CUSTOMER"
      ? [
          { label: "Browse", href: "/browse" },
          { label: "Events", href: "/customer/events" },
          { label: "Shortlist", href: "/customer/shortlist" },
          { label: "Bookings", href: "/customer/bookings" },
          { label: "Messages", href: "/customer/messages" },
          { label: "Alerts", href: "/customer/notifications", badge: unread },
          { label: "Profile", href: "/customer/profile" },
        ]
      : session.role === "VENDOR"
        ? [
            { label: "Dashboard", href: "/vendor" },
            { label: "Listings", href: "/vendor/listings" },
            { label: "Bookings", href: "/vendor/bookings" },
            { label: "Messages", href: "/vendor/messages" },
            { label: "Alerts", href: "/vendor/notifications", badge: unread },
            { label: "Profile", href: "/vendor/profile" },
          ]
        : undefined;

  return <SiteHeader navLinks={navLinks} isLoggedIn />;
}

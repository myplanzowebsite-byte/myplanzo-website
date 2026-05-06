import { SiteHeader } from "@/components/SiteHeader";
import { readSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const CUSTOMER_NAV = [
  { label: "Browse", href: "/browse" },
  { label: "Shortlist", href: "/customer/shortlist" },
  { label: "Bookings", href: "/customer/bookings" },
];

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const session = await readSession();
  const isLoggedIn = !!(session?.sub);

  return (
    <div className="min-h-screen bg-mp-canvas">
      <SiteHeader navLinks={CUSTOMER_NAV} isLoggedIn={isLoggedIn} />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

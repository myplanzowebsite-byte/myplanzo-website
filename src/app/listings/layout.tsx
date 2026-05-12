import { SiteHeader } from "@/components/SiteHeader";
import { readSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function ListingsLayout({ children }: { children: React.ReactNode }) {
  const session = await readSession();
  const isLoggedIn = !!session?.sub;
  return (
    <div className="min-h-screen bg-mp-canvas">
      <SiteHeader isLoggedIn={isLoggedIn} />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

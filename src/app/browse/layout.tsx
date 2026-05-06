import { SiteHeader } from "@/components/SiteHeader";

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mp-canvas">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

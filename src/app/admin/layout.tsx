import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mp-canvas lg:flex">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-10">{children}</main>
    </div>
  );
}

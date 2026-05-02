import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-mp-canvas">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-6 lg:p-10">{children}</div>
    </div>
  );
}

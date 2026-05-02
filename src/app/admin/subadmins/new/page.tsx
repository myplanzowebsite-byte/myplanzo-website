import { AdminHeader } from "@/components/admin/AdminHeader";
import { SubadminCreateForm } from "@/components/admin/SubadminCreateForm";

export default function AdminSubadminNewPage() {
  return (
    <>
      <AdminHeader title="Create Subadmin" breadcrumbs={["Manage Sub Admin", "Create"]} />
      <SubadminCreateForm />
    </>
  );
}

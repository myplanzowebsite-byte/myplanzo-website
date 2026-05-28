import { prisma } from "@/lib/prisma";

// Server-only — the single source of truth for the category list shown across
// browse chips, vendor listing forms, customer profile preferences, and the
// welcome flow. Admins manage rows via /admin/cms/vendor-categories.
export type VendorCategoryOption = {
  id: string;
  emoji: string;
  title: string;
  sortOrder: number;
};

export async function getVendorCategories(): Promise<VendorCategoryOption[]> {
  const rows = await prisma.vendorCategory.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, emoji: true, title: true, sortOrder: true },
  });
  return rows;
}

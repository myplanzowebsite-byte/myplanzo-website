import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.vendorCategory.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Failed to fetch vendor categories" }, { status: 500 });
  }
}

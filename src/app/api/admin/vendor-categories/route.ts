import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

export async function GET() {
  try {
    const categories = await prisma.vendorCategory.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Failed to fetch vendor categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { session, error: authError } = await requireSession(["ADMIN", "SUBADMIN"]);
  if (authError || !session) {
    return NextResponse.json({ error: authError ?? "Unauthorized" }, { status: authError === "Forbidden" ? 403 : 401 });
  }

  try {
    const body = await request.json();
    const { emoji, title, sortOrder, active } = body;

    if (!emoji || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const category = await prisma.vendorCategory.create({
      data: {
        emoji,
        title,
        sortOrder: sortOrder ?? 0,
        active: active !== false,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create vendor category" }, { status: 500 });
  }
}

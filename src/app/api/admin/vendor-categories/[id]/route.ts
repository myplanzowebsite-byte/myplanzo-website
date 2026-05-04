import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

export async function PATCH(request: NextRequest, context: unknown) {
  const { params } = context as { params: { id: string } };
  const { session, error: authError } = await requireSession(["ADMIN", "SUBADMIN"]);
  if (authError || !session) {
    return NextResponse.json({ error: authError ?? "Unauthorized" }, { status: authError === "Forbidden" ? 403 : 401 });
  }

  try {
    const body = await request.json();
    const { emoji, title, sortOrder, active } = body;

    const category = await prisma.vendorCategory.update({
      where: { id: params.id },
      data: {
        ...(emoji && { emoji }),
        ...(title && { title }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(category);
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err.code === "P2025") {
      return NextResponse.json({ error: "Vendor category not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update vendor category" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: unknown) {
  const { params } = context as { params: { id: string } };
  const { session, error: authError } = await requireSession(["ADMIN", "SUBADMIN"]);
  if (authError || !session) {
    return NextResponse.json({ error: authError ?? "Unauthorized" }, { status: authError === "Forbidden" ? 403 : 401 });
  }

  try {
    await prisma.vendorCategory.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err.code === "P2025") {
      return NextResponse.json({ error: "Vendor category not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete vendor category" }, { status: 500 });
  }
}

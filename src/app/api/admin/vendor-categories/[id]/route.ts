import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireSession(request);
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
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Vendor category not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update vendor category" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireSession(request);

    await prisma.vendorCategory.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Vendor category not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete vendor category" }, { status: 500 });
  }
}

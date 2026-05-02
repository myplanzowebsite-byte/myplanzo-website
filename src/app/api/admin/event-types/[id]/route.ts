import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireSession(request);
    const body = await request.json();
    const { emoji, title, description, sortOrder, active } = body;

    const eventType = await prisma.eventType.update({
      where: { id: params.id },
      data: {
        ...(emoji && { emoji }),
        ...(title && { title }),
        ...(description && { description }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(eventType);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Event type not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update event type" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireSession(request);

    await prisma.eventType.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Event type not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete event type" }, { status: 500 });
  }
}

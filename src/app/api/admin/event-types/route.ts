import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

export async function GET() {
  try {
    const eventTypes = await prisma.eventType.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(eventTypes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch event types" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSession(request);
    const body = await request.json();
    const { emoji, title, description, sortOrder, active } = body;

    if (!emoji || !title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const eventType = await prisma.eventType.create({
      data: {
        emoji,
        title,
        description,
        sortOrder: sortOrder ?? 0,
        active: active !== false,
      },
    });

    return NextResponse.json(eventType, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to create event type" }, { status: 500 });
  }
}

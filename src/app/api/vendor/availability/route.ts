import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

// Dates are handled as plain YYYY-MM-DD strings and stored at UTC midnight.
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

function toUtcMidnight(ymd: string) {
  return new Date(`${ymd}T00:00:00.000Z`);
}

async function vendorFor(userId: string) {
  return prisma.vendorProfile.findUnique({ where: { userId } });
}

export async function GET() {
  const { session, error } = await requireSession(["VENDOR"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const vendor = await vendorFor(session.sub);
  if (!vendor) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const rows = await prisma.vendorAvailability.findMany({
    where: { vendorId: vendor.id },
    select: { date: true },
  });
  return NextResponse.json({
    blocked: rows.map((r) => r.date.toISOString().slice(0, 10)),
  });
}

export async function POST(req: Request) {
  const { session, error } = await requireSession(["VENDOR"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const vendor = await vendorFor(session.sub);
  if (!vendor) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const json = await req.json().catch(() => null);
  const parsed = z.object({ date: dateSchema }).safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  await prisma.vendorAvailability.upsert({
    where: { vendorId_date: { vendorId: vendor.id, date: toUtcMidnight(parsed.data.date) } },
    create: { vendorId: vendor.id, date: toUtcMidnight(parsed.data.date) },
    update: {},
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { session, error } = await requireSession(["VENDOR"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const vendor = await vendorFor(session.sub);
  if (!vendor) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const date = new URL(req.url).searchParams.get("date") ?? "";
  if (!dateSchema.safeParse(date).success) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  await prisma.vendorAvailability.deleteMany({
    where: { vendorId: vendor.id, date: toUtcMidnight(date) },
  });
  return NextResponse.json({ ok: true });
}

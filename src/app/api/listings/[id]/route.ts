import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const listing = await prisma.serviceListing.findFirst({
    where: { id, status: "ACTIVE", vendor: { verificationStatus: "ACTIVE" } },
    include: { vendor: true },
  });
  if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ listing });
}

const patchSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(4).optional(),
  priceMin: z.number().int().nullable().optional(),
  priceMax: z.number().int().nullable().optional(),
  eventTags: z.array(z.string()).optional(),
  location: z.string().nullable().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireSession(["VENDOR"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const vendor = await prisma.vendorProfile.findUnique({ where: { userId: session.sub } });
  if (!vendor) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const existing = await prisma.serviceListing.findFirst({
    where: { id, vendorId: vendor.id },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const listing = await prisma.serviceListing.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json({ listing });
}

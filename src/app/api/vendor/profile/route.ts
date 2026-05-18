import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

export async function GET() {
  const { session, error } = await requireSession(["VENDOR"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const profile = await prisma.vendorProfile.findUnique({ where: { userId: session.sub } });
  return NextResponse.json({ profile });
}

const url = z.string().trim().url().max(2000);

const patchSchema = z.object({
  businessName: z.string().trim().min(2).max(160).optional(),
  description: z.string().trim().max(4000).optional(),
  location: z.string().trim().max(160).optional(),
  photoUrl: url.nullable().optional(),
  coverImageUrl: url.nullable().optional(),
  categories: z.array(z.string().trim().min(1).max(60)).max(8).optional(),
  contactPreference: z.string().trim().max(60).nullable().optional(),
  portfolioUrls: z.array(url).max(24).optional(),
});

export async function PATCH(req: Request) {
  const { session, error } = await requireSession(["VENDOR"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const profile = await prisma.vendorProfile.findUnique({ where: { userId: session.sub } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const updated = await prisma.vendorProfile.update({
    where: { id: profile.id },
    data: parsed.data,
  });
  return NextResponse.json({ profile: updated });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { ListingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

// Admins approve a vendor's service listing (ACTIVE) or reject/take it down
// (ARCHIVED). Mirrors the vendor-verification moderation flow.
const bodySchema = z.object({
  status: z.nativeEnum(ListingStatus).refine((s) => s === "ACTIVE" || s === "ARCHIVED", {
    message: "Status must be ACTIVE (approve) or ARCHIVED (reject).",
  }),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireSession(["ADMIN", "SUBADMIN"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const existing = await prisma.serviceListing.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await prisma.serviceListing.update({
    where: { id },
    data: { status: parsed.data.status },
  });
  await prisma.accessLog.create({
    data: {
      userId: session.sub,
      action: "listing_moderate",
      meta: { listingId: id, status: parsed.data.status },
    },
  });
  return NextResponse.json({ ok: true });
}

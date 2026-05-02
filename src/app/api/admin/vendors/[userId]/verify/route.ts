import { NextResponse } from "next/server";
import { z } from "zod";
import { VendorVerificationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

const bodySchema = z.object({
  status: z.nativeEnum(VendorVerificationStatus).refine((s) => s === "ACTIVE" || s === "REJECTED"),
});

export async function POST(req: Request, ctx: { params: Promise<{ userId: string }> }) {
  const { session, error } = await requireSession(["ADMIN", "SUBADMIN"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { userId: vendorUserId } = await ctx.params;
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const vendorUser = await prisma.user.findFirst({
    where: { id: vendorUserId, role: "VENDOR" },
    include: { vendorProfile: true },
  });
  if (!vendorUser?.vendorProfile) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await prisma.vendorProfile.update({
    where: { id: vendorUser.vendorProfile.id },
    data: { verificationStatus: parsed.data.status },
  });
  await prisma.accessLog.create({
    data: {
      userId: session.sub,
      action: "vendor_verify",
      meta: { vendorUserId, status: parsed.data.status },
    },
  });
  return NextResponse.json({ ok: true });
}

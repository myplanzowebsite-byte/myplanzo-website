import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const listings = await prisma.serviceListing.findMany({
    where: {
      status: "ACTIVE",
      vendor: { verificationStatus: "ACTIVE" },
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { vendor: { include: { user: { select: { id: true } } } } },
    orderBy: { updatedAt: "desc" },
    take: 60,
  });
  return NextResponse.json({ listings });
}

const createSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(4),
  priceMin: z.number().int().optional(),
  priceMax: z.number().int().optional(),
  eventTags: z.array(z.string()).optional(),
  location: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE"]).optional(),
});

export async function POST(req: Request) {
  const { session, error } = await requireSession(["VENDOR"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const vendor = await prisma.vendorProfile.findUnique({ where: { userId: session.sub } });
  if (!vendor || vendor.verificationStatus !== "ACTIVE") {
    return NextResponse.json({ error: "Vendor not verified" }, { status: 403 });
  }
  const json = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const listing = await prisma.serviceListing.create({
    data: {
      vendorId: vendor.id,
      title: parsed.data.title,
      description: parsed.data.description,
      priceMin: parsed.data.priceMin,
      priceMax: parsed.data.priceMax,
      eventTags: parsed.data.eventTags ?? [],
      location: parsed.data.location,
      status: parsed.data.status ?? "DRAFT",
    },
  });
  return NextResponse.json({ listing });
}

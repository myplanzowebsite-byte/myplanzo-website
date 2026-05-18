import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

export async function GET() {
  const { session, error } = await requireSession(["CUSTOMER"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { email: true, phone: true, customerProfile: true },
  });
  return NextResponse.json({ user });
}

const patchSchema = z.object({
  displayName: z.string().trim().min(1).max(120).optional(),
  photoUrl: z.string().trim().url().max(2000).optional().or(z.literal("")),
  preferences: z
    .object({
      eventType: z.string().max(120).optional(),
      location: z.string().max(120).optional(),
      budgetRange: z.string().max(60).optional(),
      categories: z.array(z.string().trim().min(1).max(60)).max(8).optional(),
    })
    .optional(),
  notificationPrefs: z
    .object({
      bookingUpdates: z.boolean(),
      quotes: z.boolean(),
      messages: z.boolean(),
    })
    .optional(),
});

export async function PATCH(req: Request) {
  const { session, error } = await requireSession(["CUSTOMER"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { displayName, photoUrl, preferences, notificationPrefs } = parsed.data;

  const data = {
    displayName: displayName ?? undefined,
    photoUrl: photoUrl === "" ? null : photoUrl ?? undefined,
    preferences: preferences ?? undefined,
    notificationPrefs: notificationPrefs ?? undefined,
  };

  await prisma.customerProfile.upsert({
    where: { userId: session.sub },
    create: { userId: session.sub, ...data, photoUrl: data.photoUrl ?? null },
    update: data,
  });
  return NextResponse.json({ ok: true });
}

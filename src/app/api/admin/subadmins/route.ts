import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";
import { hashPassword } from "@/lib/auth/password";

const bodySchema = z.object({
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const { session, error } = await requireSession(["ADMIN"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const exists = await prisma.user.findFirst({
    where: { OR: [{ email: parsed.data.email }, { phone: parsed.data.phone }] },
  });
  if (exists) {
    return NextResponse.json({ error: "Email or phone taken" }, { status: 409 });
  }
  await prisma.user.create({
    data: {
      email: parsed.data.email,
      phone: parsed.data.phone,
      passwordHash: await hashPassword(parsed.data.password),
      role: "SUBADMIN",
      phoneVerified: true,
      permissions: {},
    },
  });
  await prisma.accessLog.create({
    data: { userId: session.sub, action: "subadmin_create", meta: { email: parsed.data.email } },
  });
  return NextResponse.json({ ok: true });
}

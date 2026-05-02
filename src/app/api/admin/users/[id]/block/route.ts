import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireSession(["ADMIN", "SUBADMIN"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.user.update({
    where: { id },
    data: { isBlocked: !user.isBlocked },
  });
  await prisma.accessLog.create({
    data: {
      userId: session.sub,
      action: user.isBlocked ? "user_unblock" : "user_block",
      meta: { targetUserId: id },
    },
  });
  return NextResponse.json({ ok: true });
}

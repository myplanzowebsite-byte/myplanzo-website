import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/requireSession";
import { sendMsg91Flow } from "@/lib/sms/send";

const bodySchema = z.object({
  template: z.enum(["new_vendors"]),
});

const FLOW_BY_TEMPLATE: Record<z.infer<typeof bodySchema>["template"], string | undefined> = {
  new_vendors: process.env.MSG91_NEW_VENDORS_FLOW_ID,
};

const BATCH = 50;
const BATCH_DELAY_MS = 1000;

export async function POST(req: Request) {
  const { session, error } = await requireSession(["ADMIN", "SUBADMIN"]);
  if (error || !session) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
  }
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const flowId = FLOW_BY_TEMPLATE[parsed.data.template];

  const recipients = await prisma.user.findMany({
    where: { role: "CUSTOMER", phoneVerified: true, phone: { not: null }, isBlocked: false, deletedAt: null },
    select: { phone: true },
  });

  let queued = 0;
  for (let i = 0; i < recipients.length; i += BATCH) {
    const chunk = recipients.slice(i, i + BATCH);
    await Promise.all(
      chunk.map((r) =>
        r.phone ? sendMsg91Flow(r.phone, flowId, {}).then((res) => (res.ok ? queued++ : null)) : null,
      ),
    );
    if (i + BATCH < recipients.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  return NextResponse.json({ queued });
}

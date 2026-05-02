import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { issueOtp } from "@/lib/auth/otp";

const bodySchema = z.object({
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  password: z.string().min(8),
  role: z.enum(["CUSTOMER", "VENDOR"]),
  displayName: z.string().min(1).optional(),
  businessName: z.string().min(1).optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }
  const { email, phone, password, role, displayName, businessName } = parsed.data;
  if (role === "VENDOR" && !businessName) {
    return NextResponse.json({ error: "businessName required for vendors" }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { phone }] },
  });
  if (existing) {
    return NextResponse.json({ error: "Email or phone already registered" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      phone,
      passwordHash,
      role,
      phoneVerified: false,
      customerProfile:
        role === "CUSTOMER"
          ? { create: { displayName: displayName ?? email.split("@")[0] } }
          : undefined,
      vendorProfile:
        role === "VENDOR"
          ? {
              create: {
                businessName: businessName!,
                verificationStatus: "PENDING",
              },
            }
          : undefined,
    },
  });

  await issueOtp(phone, "register", user.id);

  const devCode =
    process.env.NODE_ENV === "development" ? await prisma.otpCode.findFirst({
      where: { phone, purpose: "register", consumed: false },
      orderBy: { createdAt: "desc" },
    }) : null;

  return NextResponse.json({
    ok: true,
    userId: user.id,
    next: "verify-otp",
    ...(process.env.NODE_ENV === "development" && devCode ? { devOtp: devCode.code } : {}),
  });
}

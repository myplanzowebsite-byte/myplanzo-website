import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import type { UserRole } from "@prisma/client";

function getSecret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) return null;
  return new TextEncoder().encode(s);
}

async function verifySession(token: string) {
  const secret = getSecret();
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { sub?: string; role?: UserRole; email?: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("mp_session")?.value;

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url),
      );
    }
    const p = await verifySession(token);
    if (!p?.sub || (p.role !== "ADMIN" && p.role !== "SUBADMIN")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/vendor")) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url),
      );
    }
    const p = await verifySession(token);
    if (!p?.sub || p.role !== "VENDOR") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/customer")) {
    // Shortlist shows a login prompt when unauthenticated — don't hard-block
    if (pathname.startsWith("/customer/shortlist")) {
      return NextResponse.next();
    }
    if (!token) {
      return NextResponse.redirect(
        new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url),
      );
    }
    const p = await verifySession(token);
    if (!p?.sub || p.role !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/vendor", "/vendor/:path*", "/customer", "/customer/:path*"],
};

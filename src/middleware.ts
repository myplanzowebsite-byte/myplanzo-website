import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import type { UserRole } from "@prisma/client";

const COOKIE = "mp_session";
const WEEK_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = JWTPayload & { sub?: string; role?: UserRole; email?: string };

function getSecret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) return null;
  return new TextEncoder().encode(s);
}

async function verifySession(token: string): Promise<SessionPayload | null> {
  const secret = getSecret();
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Returns NextResponse.next(), and — if the session is more than halfway to
 * expiry — re-issues a fresh 7-day token (sliding session). Active users stay
 * logged in; idle ones still expire after 7 days.
 */
async function nextWithRefresh(payload: SessionPayload): Promise<NextResponse> {
  const res = NextResponse.next();
  const secret = getSecret();
  const exp = typeof payload.exp === "number" ? payload.exp : 0;
  const now = Math.floor(Date.now() / 1000);

  if (secret && payload.sub && exp - now < WEEK_SECONDS / 2) {
    const fresh = await new SignJWT({ role: payload.role, email: payload.email })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(payload.sub)
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);
    res.cookies.set(COOKIE, fresh, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: WEEK_SECONDS,
    });
  }
  return res;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE)?.value;
  const loginRedirect = () =>
    NextResponse.redirect(
      new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url),
    );

  if (pathname.startsWith("/admin")) {
    if (!token) return loginRedirect();
    const p = await verifySession(token);
    if (!p?.sub || (p.role !== "ADMIN" && p.role !== "SUBADMIN")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return nextWithRefresh(p);
  }

  if (pathname.startsWith("/vendor")) {
    if (!token) return loginRedirect();
    const p = await verifySession(token);
    if (!p?.sub || p.role !== "VENDOR") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return nextWithRefresh(p);
  }

  if (pathname.startsWith("/customer")) {
    // Listing pages live at /listings/[id] now (public); the /customer/listings/[id]
    // route is just a redirect shim, so let it through without auth.
    if (pathname.startsWith("/customer/listings")) {
      return NextResponse.next();
    }
    // Shortlist shows a login prompt when unauthenticated — don't hard-block
    if (pathname.startsWith("/customer/shortlist")) {
      return NextResponse.next();
    }
    if (!token) return loginRedirect();
    const p = await verifySession(token);
    if (!p?.sub || p.role !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return nextWithRefresh(p);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/vendor", "/vendor/:path*", "/customer", "/customer/:path*"],
};

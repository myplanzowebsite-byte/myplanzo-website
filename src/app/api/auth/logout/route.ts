import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";

function loginUrl(req: Request) {
  return new URL("/login", req.url);
}

export async function POST(req: Request) {
  await clearSessionCookie();
  return NextResponse.redirect(loginUrl(req));
}

export async function GET(req: Request) {
  await clearSessionCookie();
  return NextResponse.redirect(loginUrl(req));
}

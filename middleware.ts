import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/calls", "/contacts", "/leads", "/settings"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const sessionSecret = process.env.SESSION_SECRET ?? "dev-session-secret";
  const cookie = request.cookies.get("rb_session")?.value;

  if (cookie !== sessionSecret) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/calls/:path*", "/contacts/:path*", "/leads/:path*", "/settings/:path*"],
};

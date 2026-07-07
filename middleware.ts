import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/calls", "/contacts", "/leads", "/settings"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionSecret = process.env.SESSION_SECRET ?? "dev-session-secret";
  const cookie = request.cookies.get("rb_session")?.value;
  const isLoggedIn = cookie === sessionSecret;

  // Logged-in users visiting the marketing homepage go to their dashboard
  if (pathname === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Logged-in users visiting login go to dashboard
  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*", "/calls/:path*", "/contacts/:path*", "/leads/:path*", "/settings/:path*"],
};

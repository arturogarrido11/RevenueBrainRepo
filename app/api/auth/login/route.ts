import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body as { email?: string; password?: string };
    const ownerEmail = process.env.OWNER_EMAIL ?? "owner@revenuebrain.ai";
    const ownerPassword = process.env.OWNER_PASSWORD ?? "changeme123";
    const sessionSecret = process.env.SESSION_SECRET ?? "dev-session-secret";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    if (email.toLowerCase() === ownerEmail.toLowerCase() && password === ownerPassword) {
      const res = NextResponse.json({ role: "owner" });
      res.cookies.set("rb_session", sessionSecret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return res;
    }

    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

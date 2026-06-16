import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body as { email?: string; password?: string };
    const ownerEmail = process.env.OWNER_EMAIL ?? "owner@revenuebrain.ai";
    const ownerPassword = process.env.OWNER_PASSWORD ?? "changeme123";
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    if (email.toLowerCase() === ownerEmail.toLowerCase() && password === ownerPassword) return NextResponse.json({ role: "owner" });
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

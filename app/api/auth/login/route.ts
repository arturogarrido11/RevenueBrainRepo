import { NextResponse } from "next/server";

// Temporary stub auth: accept any credentials and route to main dashboard.
export async function POST(request: Request) {
  // In the future, validate email/password here.
  const body = await request.json().catch(() => ({}));

  // Hardcode role to "owner" so we send users to the main dashboard area.
  return NextResponse.json({ role: "owner" });
}

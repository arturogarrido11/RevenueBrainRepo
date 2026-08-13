import { NextResponse } from "next/server";

// Temporary dev auth: accept any credentials and route to main dashboard.
// This is intentionally minimal so you can always reach the dashboard
// while we iterate on the product. Do not use this in production.
export async function POST(request: Request) {
  try {
    // Keep shape for future email/password validation, but ignore values for now.
    await request.json().catch(() => ({}));

    // For now we always treat the user as an owner and send them to /calls.
    return NextResponse.json({ role: "owner" }, { status: 200 });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "auth.login.error",
        message: error instanceof Error ? error.message : "unknown_error",
      }),
    );

    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";

const CORRECT_PASSCODE = process.env.PASSCODE || "admindb";

export async function POST(request) {
  const { passcode } = await request.json();
  if (passcode === CORRECT_PASSCODE) {
    // Optionally, set a cookie here for session
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false }, { status: 401 });
}

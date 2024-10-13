import { lucia } from "@/lib/lucia";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return NextResponse.json({ user: null });
  }

  const { user } = await lucia.validateSession(sessionId);

  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: user });
}

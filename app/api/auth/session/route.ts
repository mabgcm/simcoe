import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";

const SESSION_DURATION_MS = 60 * 60 * 24 * 14 * 1000; // 14 days

export async function POST(req: NextRequest) {
  const { idToken } = (await req.json()) as { idToken?: string };
  if (!idToken) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const sessionCookie = await getAdminAuth().createSessionCookie(idToken, { expiresIn: SESSION_DURATION_MS });
  const decoded = await getAdminAuth().verifySessionCookie(sessionCookie);
  const response = NextResponse.json({ uid: decoded.uid });
  response.cookies.set("session", sessionCookie, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000
  });
  return response;
}

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

async function requireSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return null;
  try {
    return await getAdminAuth().verifyIdToken(session);
  } catch {
    return null;
  }
}

/** Returns a single member post (only to its author). */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const decoded = await requireSession(request);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snap = await getAdminDb().collection("news").doc(params.id).get();
  if (!snap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const d = snap.data()!;
  if (d.authorId !== decoded.uid && d.source !== "member") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    id: snap.id,
    title: d.title || "",
    status: d.status || "pending_admin",
    contentType: d.contentType || "news"
  });
}

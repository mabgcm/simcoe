import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

async function requirePostOwner(request: NextRequest, postId: string) {
  const session = request.cookies.get("session")?.value;
  if (!session) return null;
  try {
    const decoded = await getAdminAuth().verifySessionCookie(session);
    const postSnap = await getAdminDb().collection("news").doc(postId).get();
    if (!postSnap.exists) return null;
    if (postSnap.data()?.authorId !== decoded.uid) return null;
    return { uid: decoded.uid };
  } catch {
    return null;
  }
}

/** Post owner approves or rejects a pending comment. */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  const owner = await requirePostOwner(request, params.id);
  if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as Record<string, unknown>;
  const action = body.action;
  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  }

  await getAdminDb()
    .collection("news").doc(params.id)
    .collection("comments").doc(params.commentId)
    .set({ status: action === "approve" ? "approved" : "rejected", updatedAt: FieldValue.serverTimestamp() }, { merge: true });

  return NextResponse.json({ ok: true });
}

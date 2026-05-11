import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

async function requireActiveMember(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return null;
  try {
    const decoded = await getAdminAuth().verifySessionCookie(session);
    const snap = await getAdminDb().collection("users").doc(decoded.uid).get();
    const data = snap.data();
    if (data?.membershipStatus !== "active") return null;
    return {
      uid: decoded.uid,
      name: (data?.displayName as string | undefined) || decoded.name || decoded.email || "Üye",
      photoURL: (data?.photoURL as string | undefined) || decoded.picture || ""
    };
  } catch {
    return null;
  }
}

/** Adds a comment to a published member post (pending author approval). */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const member = await requireActiveMember(request);
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const postSnap = await getAdminDb().collection("news").doc(params.id).get();
  if (!postSnap.exists || postSnap.data()?.status !== "published") {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }
  const postAuthorId = postSnap.data()?.authorId as string | undefined;

  const body = await request.json() as Record<string, unknown>;
  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!content) return NextResponse.json({ error: "Yorum boş olamaz." }, { status: 400 });
  const parentId = typeof body.parentId === "string" ? body.parentId : null;

  // If replying, verify the parent comment exists and is approved.
  if (parentId) {
    const parentSnap = await getAdminDb()
      .collection("news").doc(params.id)
      .collection("comments").doc(parentId).get();
    if (!parentSnap.exists || parentSnap.data()?.status !== "approved" || parentSnap.data()?.parentId) {
      return NextResponse.json({ error: "Geçersiz yorum." }, { status: 400 });
    }
  }

  // Post author's own comments/replies are auto-approved.
  const isAuthor = member.uid === postAuthorId;

  const commentRef = await getAdminDb()
    .collection("news").doc(params.id)
    .collection("comments")
    .add({
      authorId: member.uid,
      authorName: member.name,
      authorPhotoURL: member.photoURL,
      content,
      parentId,
      status: isAuthor ? "approved" : "pending",
      createdAt: FieldValue.serverTimestamp()
    });

  return NextResponse.json({ id: commentRef.id, autoApproved: isAuthor });
}

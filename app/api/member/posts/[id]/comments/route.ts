import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

async function requireActiveMember(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return null;
  try {
    const decoded = await getAdminAuth().verifyIdToken(session);
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

  const body = await request.json() as Record<string, unknown>;
  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!content) return NextResponse.json({ error: "Yorum boş olamaz." }, { status: 400 });

  const commentRef = await getAdminDb()
    .collection("news").doc(params.id)
    .collection("comments")
    .add({
      authorId: member.uid,
      authorName: member.name,
      authorPhotoURL: member.photoURL,
      content,
      status: "pending",
      createdAt: FieldValue.serverTimestamp()
    });

  return NextResponse.json({ id: commentRef.id });
}

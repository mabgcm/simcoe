import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

/** Returns all comments on a post to its owner. */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = request.cookies.get("session")?.value;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded = await getAdminAuth().verifySessionCookie(session);
    const postSnap = await getAdminDb().collection("news").doc(params.id).get();
    if (!postSnap.exists || postSnap.data()?.authorId !== decoded.uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const snap = await getAdminDb()
      .collection("news").doc(params.id)
      .collection("comments")
      .get();

    const comments = snap.docs
      .sort((a, b) => {
        const at = (a.data().createdAt as { toDate?: () => Date } | null)?.toDate?.()?.getTime() ?? 0;
        const bt = (b.data().createdAt as { toDate?: () => Date } | null)?.toDate?.()?.getTime() ?? 0;
        return at - bt;
      })
      .map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        authorName: (d.authorName as string) || "Üye",
        authorPhotoURL: (d.authorPhotoURL as string) || "",
        content: (d.content as string) || "",
        status: (d.status as string) || "pending",
        createdAt: d.createdAt?.toDate?.()?.toISOString() ?? null
      };
    });

    return NextResponse.json({ comments });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

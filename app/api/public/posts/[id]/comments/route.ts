import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";

/** Returns approved comments for a published member post (public). */
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postSnap = await getAdminDb().collection("news").doc(params.id).get();
    if (!postSnap.exists || postSnap.data()?.status !== "published" || postSnap.data()?.source !== "member") {
      return NextResponse.json({ comments: [] });
    }

    const snap = await getAdminDb()
      .collection("news").doc(params.id)
      .collection("comments")
      .where("status", "==", "approved")
      .orderBy("createdAt", "asc")
      .get();

    const comments = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        authorName: (d.authorName as string) || "Üye",
        authorPhotoURL: (d.authorPhotoURL as string) || "",
        content: (d.content as string) || "",
        createdAt: d.createdAt?.toDate?.()?.toISOString() ?? null
      };
    });

    return NextResponse.json({ comments });
  } catch {
    return NextResponse.json({ comments: [] });
  }
}

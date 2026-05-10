import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

/** Returns approved comments for a published member post (public). */
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postSnap = await getAdminDb().collection("news").doc(params.id).get();
    if (!postSnap.exists || postSnap.data()?.status !== "published" || postSnap.data()?.source !== "member") {
      return NextResponse.json({ comments: [] });
    }

    // Avoid composite index: fetch all, filter in memory.
    const snap = await getAdminDb()
      .collection("news").doc(params.id)
      .collection("comments")
      .get();

    const comments = snap.docs
      .filter((doc) => doc.data().status === "approved")
      .map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          authorName: (d.authorName as string) || "Üye",
          authorPhotoURL: (d.authorPhotoURL as string) || "",
          content: (d.content as string) || "",
          parentId: (d.parentId as string | null) ?? null,
          createdAt: (d.createdAt as { toDate?: () => Date } | null)?.toDate?.()?.toISOString() ?? null
        };
      })
      .sort((a, b) => (a.createdAt ?? "") < (b.createdAt ?? "") ? -1 : 1);

    const response = NextResponse.json({ comments });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return NextResponse.json({ comments: [] });
  }
}

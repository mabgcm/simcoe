import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { slugify } from "@/lib/utils/slugify";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

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

/** Lists the authenticated member's own posts. */
export async function GET(request: NextRequest) {
  const member = await requireActiveMember(request);
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snap = await getAdminDb()
    .collection("news")
    .where("authorId", "==", member.uid)
    .limit(50)
    .get();

  const posts = snap.docs.filter((doc) => doc.data().source === "member").map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      title: d.title || "",
      slug: d.slug || doc.id,
      contentType: d.contentType || "news",
      status: d.status || "pending_admin",
      createdAt: d.createdAt?.toDate?.()?.toISOString() ?? null
    };
  });

  return NextResponse.json({ posts });
}

/** Creates a member news/announcement post (pending admin approval). */
export async function POST(request: NextRequest) {
  const member = await requireActiveMember(request);
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as Record<string, unknown>;
  const rawType = asString(body.contentType);
  const contentType = rawType === "announcement" ? "announcement" : "news";
  const title = asString(body.title);
  const content = asString(body.content);
  if (!title) return NextResponse.json({ error: "Başlık gerekli." }, { status: 400 });
  if (!content) return NextResponse.json({ error: "İçerik gerekli." }, { status: 400 });

  const slug = `${slugify(title)}-${Date.now()}`;
  const now = FieldValue.serverTimestamp();

  const docRef = await getAdminDb().collection("news").add({
    title,
    slug,
    excerpt: asString(body.excerpt),
    content,
    body: content,
    coverImage: asString(body.coverImage),
    category: asString(body.category) || (contentType === "announcement" ? "Duyuru" : "Haber"),
    tags: [],
    author: member.name,
    authorId: member.uid,
    authorPhotoURL: member.photoURL,
    source: "member",
    status: "pending_admin",
    contentType,
    type: contentType,
    publishedAt: null,
    createdAt: now,
    updatedAt: now,
    viewCount: 0
  });

  return NextResponse.json({ id: docRef.id, slug });
}

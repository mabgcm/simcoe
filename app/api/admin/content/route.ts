import { NextRequest, NextResponse } from "next/server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { slugify } from "@/lib/utils/slugify";

const contentTypes = ["news", "announcement", "event"] as const;
const statuses = ["draft", "published", "scheduled"] as const;

type ContentType = (typeof contentTypes)[number];
type PublishStatus = (typeof statuses)[number];

function isContentType(value: unknown): value is ContentType {
  return typeof value === "string" && contentTypes.includes(value as ContentType);
}

function isStatus(value: unknown): value is PublishStatus {
  return typeof value === "string" && statuses.includes(value as PublishStatus);
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value: unknown, fallback = 0) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function asDate(value: unknown, fallback = new Date()) {
  const date = new Date(asString(value) || fallback);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

function scheduledTimestamp(status: PublishStatus, value: unknown) {
  if (status !== "scheduled") return null;
  const date = asDate(value);
  return Timestamp.fromDate(date);
}

async function requireAdmin(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value;
  if (!sessionCookie) return null;

  const decoded = await getAdminAuth().verifyIdToken(sessionCookie);
  const userDoc = await getAdminDb().collection("users").doc(decoded.uid).get();
  const role = userDoc.data()?.role;
  if (role !== "admin" && role !== "super_admin") return null;

  return {
    uid: decoded.uid,
    email: decoded.email || "",
    name: userDoc.data()?.displayName || decoded.name || decoded.email || "Admin"
  };
}

/** Creates news, announcements or events from the unified admin content form. */
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const contentType = isContentType(body.contentType) ? body.contentType : "news";
    const status = isStatus(body.status) ? body.status : "draft";
    const title = asString(body.title);
    const content = asString(body.content);
    const slug = slugify(asString(body.slug) || title);

    if (!title || !slug) return NextResponse.json({ error: "Title is required." }, { status: 400 });
    if (!content) return NextResponse.json({ error: "Content is required." }, { status: 400 });

    const now = FieldValue.serverTimestamp();
    const publishAt = scheduledTimestamp(status, body.scheduledAt);
    const publishedAt = status === "published" ? now : publishAt;

    if (contentType === "event") {
      const startDate = asDate(body.startDate);
      const endDate = asDate(body.endDate, startDate);
      const docRef = await getAdminDb().collection("events").add({
        title,
        slug,
        description: content,
        content,
        conditions: asString(body.conditions),
        location: asString(body.location),
        address: asString(body.address) || asString(body.location),
        startDate: Timestamp.fromDate(startDate),
        endDate: Timestamp.fromDate(endDate),
        coverImage: asString(body.coverImage),
        gallery: [],
        category: asString(body.category) || "Etkinlik",
        capacity: body.capacity ? asNumber(body.capacity) : null,
        registrationRequired: Boolean(body.registrationRequired),
        registrationDeadline: null,
        price: asNumber(body.price),
        status: "upcoming",
        publishStatus: status,
        publishedAt,
        scheduledAt: publishAt,
        author: admin.name,
        authorId: admin.uid,
        createdAt: now,
        updatedAt: now
      });

      return NextResponse.json({ id: docRef.id, slug, collection: "events" });
    }

    const docRef = await getAdminDb().collection("news").add({
      title,
      slug,
      excerpt: asString(body.excerpt),
      content,
      body: content,
      coverImage: asString(body.coverImage),
      image: asString(body.coverImage),
      category: asString(body.category) || (contentType === "announcement" ? "Duyuru" : "Haber"),
      tags: [],
      author: admin.name,
      authorId: admin.uid,
      status,
      contentType,
      type: contentType === "announcement" ? "announcement" : "news",
      pinned: Boolean(body.pinned),
      publishedAt,
      scheduledAt: publishAt,
      createdAt: now,
      updatedAt: now,
      viewCount: 0
    });

    return NextResponse.json({ id: docRef.id, slug, collection: "news" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Content could not be saved." }, { status: 500 });
  }
}

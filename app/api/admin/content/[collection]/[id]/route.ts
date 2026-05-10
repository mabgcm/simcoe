import { NextRequest, NextResponse } from "next/server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { slugify } from "@/lib/utils/slugify";

const collections = ["news", "events"] as const;
const statuses = ["draft", "published", "scheduled"] as const;

type CollectionName = (typeof collections)[number];
type PublishStatus = (typeof statuses)[number];

function isCollection(value: unknown): value is CollectionName {
  return typeof value === "string" && collections.includes(value as CollectionName);
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
  return Timestamp.fromDate(asDate(value));
}

async function requireAdmin(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return null;

  const decoded = await getAdminAuth().verifyIdToken(session);
  const userDoc = await getAdminDb().collection("users").doc(decoded.uid).get();
  const role = userDoc.data()?.role;
  if (role !== "admin" && role !== "super_admin") return null;
  return { uid: decoded.uid, role };
}

async function getOwnedDocument(request: NextRequest, collection: string, id: string) {
  const admin = await requireAdmin(request);
  if (!admin) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (!isCollection(collection)) return { error: NextResponse.json({ error: "Invalid collection" }, { status: 400 }) };

  const ref = getAdminDb().collection(collection).doc(id);
  const snapshot = await ref.get();
  if (!snapshot.exists) return { error: NextResponse.json({ error: "Content not found" }, { status: 404 }) };
  if (snapshot.data()?.authorId !== admin.uid) return { error: NextResponse.json({ error: "Only the creator can change this content." }, { status: 403 }) };
  return { admin, ref, data: snapshot.data() || {}, collectionName: collection as CollectionName };
}

/** Updates owner-managed admin content. */
export async function PATCH(request: NextRequest, { params }: { params: { collection: string; id: string } }) {
  try {
    const owned = await getOwnedDocument(request, params.collection, params.id);
    if ("error" in owned) return owned.error;

    const body = await request.json();
    const status = isStatus(body.status) ? body.status : "draft";
    const title = asString(body.title);
    const content = asString(body.content);
    const slug = slugify(asString(body.slug) || title);
    if (!title || !content || !slug) return NextResponse.json({ error: "Title and content are required." }, { status: 400 });

    const publishAt = scheduledTimestamp(status, body.scheduledAt);
    const publishedAt = status === "published" ? FieldValue.serverTimestamp() : publishAt;

    if (owned.collectionName === "events") {
      const startDate = asDate(body.startDate);
      const endDate = asDate(body.endDate, startDate);
      await owned.ref.set(
        {
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
          category: asString(body.category) || "Etkinlik",
          capacity: body.capacity ? asNumber(body.capacity) : null,
          price: asNumber(body.price),
          publishStatus: status,
          publishedAt,
          scheduledAt: publishAt,
          updatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
      return NextResponse.json({ ok: true });
    }

    const contentType = body.contentType === "announcement" ? "announcement" : "news";
    await owned.ref.set(
      {
        title,
        slug,
        excerpt: asString(body.excerpt),
        content,
        body: content,
        coverImage: asString(body.coverImage),
        image: asString(body.coverImage),
        category: asString(body.category) || (contentType === "announcement" ? "Duyuru" : "Haber"),
        status,
        contentType,
        type: contentType === "announcement" ? "announcement" : "news",
        publishedAt,
        scheduledAt: publishAt,
        updatedAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Content could not be updated." }, { status: 500 });
  }
}

/** Publishes owner-managed draft or scheduled content immediately. */
export async function POST(request: NextRequest, { params }: { params: { collection: string; id: string } }) {
  try {
    const owned = await getOwnedDocument(request, params.collection, params.id);
    if ("error" in owned) return owned.error;
    await owned.ref.set(
      owned.collectionName === "events"
        ? { publishStatus: "published", publishedAt: FieldValue.serverTimestamp(), scheduledAt: null, updatedAt: FieldValue.serverTimestamp() }
        : { status: "published", publishedAt: FieldValue.serverTimestamp(), scheduledAt: null, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Content could not be published." }, { status: 500 });
  }
}

/** Deletes owner-managed admin content. */
export async function DELETE(request: NextRequest, { params }: { params: { collection: string; id: string } }) {
  try {
    const owned = await getOwnedDocument(request, params.collection, params.id);
    if ("error" in owned) return owned.error;
    await owned.ref.delete();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Content could not be deleted." }, { status: 500 });
  }
}

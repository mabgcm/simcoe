import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { getEvents as getDemoEvents, getNews as getDemoNews } from "@/lib/demo-data";

export type PublicNewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  content: string;
  category: string;
  coverImage: string;
  publishedAt: Date;
  author: string;
  authorId: string;
  readMinutes: number;
  contentType?: "news" | "announcement";
  status?: "draft" | "published" | "scheduled";
  scheduledAt?: Date | null;
};

export type PublicEvent = {
  id: string;
  title: string;
  slug: string;
  description: string;
  conditions: string;
  location: string;
  address: string;
  startDate: Date;
  endDate: Date;
  coverImage: string;
  gallery: string[];
  category: string;
  capacity: number | null;
  registrationRequired: boolean;
  registrationDeadline: Date | null;
  price: number;
  status: "upcoming" | "ongoing" | "past" | "cancelled";
  author: string;
  authorId: string;
  publishStatus?: "draft" | "published" | "scheduled";
  publishedAt?: Date | null;
  scheduledAt?: Date | null;
};

function toDate(value: unknown, fallback = new Date()) {
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") return value.toDate();
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return fallback;
}

function estimateReadMinutes(html: string) {
  const words = html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function normalizeNews(id: string, data: Record<string, any>): PublicNewsArticle {
  const body = data.body || data.content || "";
  const scheduledAt = data.scheduledAt ? toDate(data.scheduledAt) : null;
  return {
    id,
    title: data.title || "",
    slug: data.slug || id,
    excerpt: data.excerpt || "",
    body,
    content: body,
    category: data.category || (data.contentType === "announcement" ? "Duyuru" : "Haber"),
    coverImage: data.coverImage || data.image || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    publishedAt: toDate(data.publishedAt || data.createdAt),
    author: data.author || "Simcoe County Turkish Association",
    authorId: data.authorId || "",
    readMinutes: data.readMinutes || estimateReadMinutes(body),
    contentType: data.contentType === "announcement" ? "announcement" : "news",
    status: data.status || "published",
    scheduledAt
  };
}

function normalizeEvent(id: string, data: Record<string, any>): PublicEvent {
  const startDate = toDate(data.startDate || data.createdAt);
  const scheduledAt = data.scheduledAt ? toDate(data.scheduledAt) : null;
  return {
    id,
    title: data.title || "",
    slug: data.slug || id,
    description: data.description || data.content || "",
    conditions: data.conditions || "",
    location: data.location || "",
    address: data.address || data.location || "",
    startDate,
    endDate: toDate(data.endDate, startDate),
    coverImage: data.coverImage || data.image || "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
    gallery: Array.isArray(data.gallery) ? data.gallery : [],
    category: data.category || "Etkinlik",
    capacity: typeof data.capacity === "number" ? data.capacity : null,
    registrationRequired: Boolean(data.registrationRequired),
    registrationDeadline: data.registrationDeadline ? toDate(data.registrationDeadline) : null,
    price: typeof data.price === "number" ? data.price : 0,
    status: data.status || "upcoming",
    author: data.author || "Simcoe County Turkish Association",
    authorId: data.authorId || "",
    publishStatus: data.publishStatus || "published",
    publishedAt: data.publishedAt ? toDate(data.publishedAt) : null,
    scheduledAt
  };
}

function isVisiblePublished(data: Record<string, any>, now = new Date()) {
  const s = data.status || data.publishStatus;
  if (s === "draft" || s === "pending_admin" || s === "rejected") return false;
  if (s === "scheduled") {
    const date = toDate(data.scheduledAt || data.publishedAt, new Date("2999-12-31"));
    return date.getTime() <= now.getTime();
  }
  return true;
}

export async function listPublishedNews(locale: string, max = 24): Promise<PublicNewsArticle[]> {
  try {
    const snapshot = await getAdminDb().collection("news").orderBy("publishedAt", "desc").limit(max).get();
    const articles = snapshot.docs.filter((doc) => isVisiblePublished(doc.data())).map((doc) => normalizeNews(doc.id, doc.data()));
    return articles.length ? articles : (getDemoNews(locale) as unknown as PublicNewsArticle[]);
  } catch (error) {
    console.error("Unable to load Firestore news.", error);
    return getDemoNews(locale) as unknown as PublicNewsArticle[];
  }
}

export async function getPublishedNewsBySlug(locale: string, slug: string) {
  const articles = await listPublishedNews(locale, 50);
  return articles.find((item) => item.slug === slug) || null;
}

export async function listEvents(locale: string, max = 50) {
  try {
    const snapshot = await getAdminDb().collection("events").orderBy("startDate", "asc").limit(max).get();
    const events = snapshot.docs
      .filter((doc) => isVisiblePublished(doc.data()))
      .map((doc) => normalizeEvent(doc.id, doc.data()))
      .filter((event) => event.status !== "cancelled");
    return events.length ? events : getDemoEvents(locale);
  } catch (error) {
    console.error("Unable to load Firestore events.", error);
    return getDemoEvents(locale);
  }
}

export async function getEventBySlug(locale: string, slug: string) {
  const events = await listEvents(locale, 80);
  return events.find((item) => item.slug === slug) || null;
}

export async function listPublishedAnnouncements(locale: string, max = 24) {
  try {
    const snapshot = await getAdminDb().collection("news").where("contentType", "==", "announcement").limit(max * 2).get();
    return snapshot.docs
      .filter((doc) => isVisiblePublished(doc.data()))
      .map((doc) => normalizeNews(doc.id, doc.data()))
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, max);
  } catch (error) {
    console.error("Unable to load Firestore announcements.", error);
    return [];
  }
}

export async function listAdminNews(max = 100) {
  const snapshot = await getAdminDb().collection("news").orderBy("createdAt", "desc").limit(max).get();
  return snapshot.docs.map((doc) => normalizeNews(doc.id, doc.data()));
}

export async function listAdminAnnouncements(max = 100) {
  const snapshot = await getAdminDb().collection("news").where("contentType", "==", "announcement").limit(max).get();
  return snapshot.docs
    .map((doc) => normalizeNews(doc.id, doc.data()))
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export async function listAdminEvents(max = 100) {
  const snapshot = await getAdminDb().collection("events").orderBy("createdAt", "desc").limit(max).get();
  return snapshot.docs.map((doc) => normalizeEvent(doc.id, doc.data()));
}

export async function getAdminNewsById(id: string) {
  const snapshot = await getAdminDb().collection("news").doc(id).get();
  return snapshot.exists ? normalizeNews(snapshot.id, snapshot.data() || {}) : null;
}

export async function listPendingMemberPosts(max = 50) {
  const snapshot = await getAdminDb()
    .collection("news")
    .where("source", "==", "member")
    .where("status", "==", "pending_admin")
    .limit(max)
    .get();
  return snapshot.docs
    .map((doc) => ({ ...normalizeNews(doc.id, doc.data()), authorPhotoURL: (doc.data().authorPhotoURL as string) || "" }))
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export async function getPostComments(postId: string) {
  const snapshot = await getAdminDb()
    .collection("news").doc(postId)
    .collection("comments")
    .orderBy("createdAt", "asc")
    .get();
  return snapshot.docs.map((doc) => {
    const d = doc.data();
    const createdAt = d.createdAt ? toDate(d.createdAt) : new Date();
    return {
      id: doc.id,
      authorId: (d.authorId as string) || "",
      authorName: (d.authorName as string) || "Üye",
      authorPhotoURL: (d.authorPhotoURL as string) || "",
      content: (d.content as string) || "",
      status: (d.status as string) || "pending",
      createdAt
    };
  });
}

export async function getAdminEventById(id: string) {
  const snapshot = await getAdminDb().collection("events").doc(id).get();
  return snapshot.exists ? normalizeEvent(snapshot.id, snapshot.data() || {}) : null;
}

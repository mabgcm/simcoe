import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

async function requireAdmin(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return null;
  try {
    const decoded = await getAdminAuth().verifySessionCookie(session);
    const snap = await getAdminDb().collection("users").doc(decoded.uid).get();
    const role = snap.data()?.role;
    if (role !== "admin" && role !== "super_admin") return null;
    return { uid: decoded.uid };
  } catch {
    return null;
  }
}

/** Admin approves a pending member post → published. */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ref = getAdminDb().collection("news").doc(params.id);
  const snap = await ref.get();
  if (!snap.exists || snap.data()?.source !== "member") {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  await ref.set(
    { status: "published", publishedAt: FieldValue.serverTimestamp(), approvedBy: admin.uid, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );

  return NextResponse.json({ ok: true });
}

/** Admin rejects a pending member post. */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ref = getAdminDb().collection("news").doc(params.id);
  const snap = await ref.get();
  if (!snap.exists || snap.data()?.source !== "member") {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  await ref.set(
    { status: "rejected", rejectedBy: admin.uid, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );

  return NextResponse.json({ ok: true });
}

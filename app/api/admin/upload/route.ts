import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb, getAdminStorage } from "@/lib/firebase/admin";

const maxSize = 10 * 1024 * 1024;

async function requireAdmin(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return null;

  const decoded = await getAdminAuth().verifyIdToken(session);
  const userDoc = await getAdminDb().collection("users").doc(decoded.uid).get();
  const role = userDoc.data()?.role;
  if (role !== "admin" && role !== "super_admin") return null;

  return decoded;
}

/** Uploads admin-managed content images through Firebase Admin Storage. */
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = typeof formData.get("path") === "string" ? String(formData.get("path")) : "content";
    if (!(file instanceof File)) return NextResponse.json({ error: "Missing file" }, { status: 400 });
    if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    if (file.size > maxSize) return NextResponse.json({ error: "File is too large" }, { status: 400 });

    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucketName) return NextResponse.json({ error: "Storage bucket is not configured" }, { status: 500 });

    const token = randomUUID();
    const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, "-").replace(/^\/+/, "") || "content";
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${safeFolder}/${randomUUID()}-${safeName}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    await getAdminStorage().bucket(bucketName).file(path).save(bytes, {
      metadata: {
        contentType: file.type,
        metadata: {
          firebaseStorageDownloadTokens: token,
          uploadedBy: admin.uid
        }
      }
    });

    const url = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
    return NextResponse.json({ url, path });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Image could not be uploaded." }, { status: 500 });
  }
}

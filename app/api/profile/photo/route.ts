import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb, getAdminStorage } from "@/lib/firebase/admin";

const maxSize = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Missing file" }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  if (file.size > maxSize) return NextResponse.json({ error: "File is too large" }, { status: 400 });

  const auth = getAdminAuth();
  const decoded = await auth.verifySessionCookie(session);
  const uid = decoded.uid;
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!bucketName) return NextResponse.json({ error: "Storage bucket is not configured" }, { status: 500 });

  const token = randomUUID();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `profiles/${uid}/${randomUUID()}-${safeName}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const bucket = getAdminStorage().bucket(bucketName);

  await bucket.file(path).save(bytes, {
    metadata: {
      contentType: file.type,
      metadata: {
        firebaseStorageDownloadTokens: token
      }
    }
  });

  const photoURL = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;

  await auth.updateUser(uid, { photoURL });
  await getAdminDb().collection("users").doc(uid).set(
    {
      photoURL,
      updatedAt: FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  return NextResponse.json({ url: photoURL });
}

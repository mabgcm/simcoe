"use client";

import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/firebase/config";

export async function uploadImage(file: File, path: string, onProgress?: (progress: number) => void) {
  const storageRef = ref(storage, `${path}/${crypto.randomUUID()}-${file.name}`);
  const task = uploadBytesResumable(storageRef, file);

  return new Promise<string>((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) => onProgress?.((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
      reject,
      async () => resolve(await getDownloadURL(task.snapshot.ref))
    );
  });
}

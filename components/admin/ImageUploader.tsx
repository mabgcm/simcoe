"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/firebase/storage";

/** Firebase Storage image uploader with progress state. */
export function ImageUploader({ path = "uploads", onUploaded, label = "Görsel Yükle" }: { path?: string; onUploaded: (url: string) => void | Promise<void>; label?: string }) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);

    try {
      const url = await uploadImage(file, path, setProgress);
      await onUploaded(url);
      toast.success("Görsel yüklendi.");
    } catch (error) {
      console.error(error);
      toast.error("Görsel yüklenemedi. Firebase Storage izinlerini kontrol edin.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-secondary hover:bg-muted">
      <Upload className="h-4 w-4 text-primary" />
      {uploading ? `%${Math.max(1, Math.round(progress))}` : label}
      <input type="file" accept="image/*" className="sr-only" onChange={handleChange} disabled={uploading} />
    </label>
  );
}

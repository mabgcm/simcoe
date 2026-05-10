"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

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
      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", path);
      setProgress(35);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      setProgress(85);
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error || "Görsel yüklenemedi.");
      const url = payload.url as string;
      await onUploaded(url);
      setProgress(100);
      toast.success("Görsel yüklendi.");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Görsel yüklenemedi.");
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

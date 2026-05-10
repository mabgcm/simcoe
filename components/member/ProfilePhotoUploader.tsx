"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

/** Uploads profile photos through the server API to avoid client Storage rule failures. */
export function ProfilePhotoUploader({ label, onUploaded }: { label: string; onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      const response = await fetch("/api/profile/photo", {
        method: "POST",
        body: formData
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Upload failed");
      }

      onUploaded(data.url);
      toast.success("Fotoğraf yüklendi.");
    } catch (error) {
      console.error(error);
      toast.error("Fotoğraf yüklenemedi. Lütfen tekrar deneyin.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-secondary hover:bg-muted">
      <Upload className="h-4 w-4 text-primary" />
      {uploading ? "Yükleniyor" : label}
      <input type="file" accept="image/*" className="sr-only" onChange={handleChange} disabled={uploading} />
    </label>
  );
}

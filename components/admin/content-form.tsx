"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { slugify } from "@/lib/utils/slugify";

/** Shared admin content form for rich text resources. */
export function ContentForm({ title }: { title: string }) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const slug = slugify(name);

  return (
    <section>
      <h1 className="font-heading text-4xl text-secondary">{title}</h1>
      <form className="mt-6 grid gap-4 rounded-lg border bg-white p-5 shadow-sm">
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Başlık" />
        <Input value={slug} readOnly aria-label="Otomatik slug" />
        <ImageUploader path="content" onUploaded={setImageUrl} />
        {imageUrl ? <Input value={imageUrl} readOnly aria-label="Yüklenen görsel URL" /> : null}
        <RichTextEditor value={content} onChange={setContent} />
        <div className="flex gap-2">
          <Button type="button">Yayınla</Button>
          <Button type="button" variant="outline">Taslak Kaydet</Button>
          <Button type="button" variant="ghost">Önizle</Button>
        </div>
      </form>
    </section>
  );
}

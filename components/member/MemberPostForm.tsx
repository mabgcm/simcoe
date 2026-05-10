"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { slugify } from "@/lib/utils/slugify";
import { useAuth } from "@/hooks/useAuth";

type ContentType = "news" | "announcement";

/** Form for active members to submit content for admin approval. */
export function MemberPostForm({ authorName, authorPhotoURL }: { authorName: string; authorPhotoURL: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const initialType = searchParams.get("type") === "announcement" ? "announcement" : "news";
  const [contentType, setContentType] = useState<ContentType>(initialType);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [saving, setSaving] = useState(false);
  const slug = useMemo(() => slugify(title), [title]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const response = await fetch("/api/member/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, title, slug, excerpt, category, content, coverImage })
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(payload?.error || "Gönderi kaydedilemedi.");
      }
      toast.success("Gönderiniz yönetici onayına gönderildi.");
      router.push("/portal/posts");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gönderi kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h1 className="font-heading text-4xl text-secondary">Yeni Gönderi</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Gönderiniz yönetici onayından sonra yayınlanacaktır.
      </p>

      {/* Author preview */}
      <div className="mt-4 flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
        {authorPhotoURL ? (
          <Image src={authorPhotoURL} alt={authorName} width={40} height={40} className="h-10 w-10 rounded-lg object-cover" unoptimized />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
            {authorName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-secondary">{authorName}</p>
          <p className="text-xs text-muted-foreground">Üye içeriği</p>
        </div>
      </div>

      <form className="mt-6 grid gap-4 rounded-lg border bg-white p-5 shadow-sm" onSubmit={submit}>
        <fieldset disabled={saving} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-secondary">
              İçerik türü
              <Select value={contentType} onChange={(e) => setContentType(e.target.value as ContentType)}>
                <option value="news">Haber</option>
                <option value="announcement">Duyuru</option>
              </Select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-secondary">
              Kategori
              <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder={contentType === "announcement" ? "Duyuru" : "Topluluk"} />
            </label>
          </div>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Başlık" required />
          <Input value={slug} readOnly aria-label="Otomatik slug" className="text-muted-foreground" />
          <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Kısa özet (opsiyonel)" />
          <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="Kapak görseli URL (opsiyonel)" />
          <RichTextEditor value={content} onChange={setContent} />
        </fieldset>
        <div className="flex gap-2">
          <Button disabled={saving || !title || !content}>
            {saving ? "Gönderiliyor..." : "Onaya Gönder"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>İptal</Button>
        </div>
      </form>
    </section>
  );
}

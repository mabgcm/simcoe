"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { slugify } from "@/lib/utils/slugify";

type ContentType = "news" | "announcement" | "event";
type PublishStatus = "published" | "draft" | "scheduled";

type ContentFormProps = {
  title: string;
  defaultType?: ContentType;
};

const defaultCoverImage = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80";

/** Unified admin content form that saves news, announcements and events to Firestore. */
export function ContentForm({ title, defaultType = "news" }: ContentFormProps) {
  const router = useRouter();
  const [contentType, setContentType] = useState<ContentType>(defaultType);
  const [status, setStatus] = useState<PublishStatus>("published");
  const [scheduledAt, setScheduledAt] = useState("");
  const [name, setName] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(defaultCoverImage);
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [price, setPrice] = useState("0");
  const [capacity, setCapacity] = useState("");
  const [conditions, setConditions] = useState("");
  const [saving, setSaving] = useState(false);
  const slug = useMemo(() => slugify(name), [name]);
  const isEvent = contentType === "event";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType,
          status,
          scheduledAt,
          title: name,
          slug,
          excerpt,
          category,
          content,
          coverImage,
          location,
          address,
          startDate,
          endDate,
          price,
          capacity,
          conditions
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "İçerik kaydedilemedi.");
      }

      toast.success("İçerik Firebase'e kaydedildi.");
      router.push(isEvent ? "/admin/events" : "/admin/news");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "İçerik kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h1 className="font-heading text-4xl text-secondary">{title}</h1>
      <form className="mt-6 grid gap-4 rounded-lg border bg-white p-5 shadow-sm" onSubmit={submit}>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-semibold text-secondary">
            İçerik türü
            <Select value={contentType} onChange={(event) => setContentType(event.target.value as ContentType)}>
              <option value="news">Haber</option>
              <option value="announcement">Duyuru</option>
              <option value="event">Etkinlik</option>
            </Select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-secondary">
            Yayın durumu
            <Select value={status} onChange={(event) => setStatus(event.target.value as PublishStatus)}>
              <option value="published">Yayınla</option>
              <option value="scheduled">Zamanla</option>
              <option value="draft">Taslak</option>
            </Select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-secondary">
            Kategori
            <Input value={category} onChange={(event) => setCategory(event.target.value)} placeholder={isEvent ? "Kültür" : contentType === "announcement" ? "Duyuru" : "Topluluk"} />
          </label>
        </div>

        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Başlık" required />
        <Input value={slug} readOnly aria-label="Otomatik slug" />

        {status === "scheduled" ? (
          <label className="grid gap-2 text-sm font-semibold text-secondary">
            Yayın zamanı
            <Input value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} type="datetime-local" required />
          </label>
        ) : null}

        {!isEvent ? <Textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} placeholder="Kısa özet" required /> : null}

        <div className="grid gap-3">
          <Input value={coverImage} onChange={(event) => setCoverImage(event.target.value)} placeholder="Kapak görseli URL" />
          <ImageUploader path="content" label="Kapak Görseli Yükle" onUploaded={setCoverImage} />
        </div>

        {isEvent ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Konum adı" required />
            <Input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Adres" />
            <Input value={startDate} onChange={(event) => setStartDate(event.target.value)} type="datetime-local" required />
            <Input value={endDate} onChange={(event) => setEndDate(event.target.value)} type="datetime-local" required />
            <Input value={price} onChange={(event) => setPrice(event.target.value)} type="number" min="0" step="0.01" placeholder="Ücret" />
            <Input value={capacity} onChange={(event) => setCapacity(event.target.value)} type="number" min="0" placeholder="Kapasite" />
            <Textarea className="md:col-span-2" value={conditions} onChange={(event) => setConditions(event.target.value)} placeholder="Katılım koşulları" />
          </div>
        ) : null}

        <RichTextEditor value={content} onChange={setContent} />
        <div className="flex gap-2">
          <Button disabled={saving || !name || !content || (status === "scheduled" && !scheduledAt) || (isEvent && (!startDate || !endDate || !location))}>{saving ? "Kaydediliyor..." : status === "published" ? "Yayınla" : status === "scheduled" ? "Zamanla" : "Taslak Kaydet"}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            İptal
          </Button>
        </div>
      </form>
    </section>
  );
}

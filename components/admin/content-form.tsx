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
  documentId?: string;
  collectionName?: "news" | "events";
  readOnly?: boolean;
  initialValues?: {
    contentType?: ContentType;
    status?: PublishStatus;
    scheduledAt?: Date | null;
    title?: string;
    slug?: string;
    excerpt?: string;
    category?: string;
    content?: string;
    coverImage?: string;
    location?: string;
    address?: string;
    startDate?: Date;
    endDate?: Date;
    price?: number;
    capacity?: number | null;
    conditions?: string;
  };
};

const defaultCoverImage = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80";

/** Unified admin content form that saves news, announcements and events to Firestore. */
function dateTimeInputValue(date?: Date | null) {
  if (!date) return "";
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

/** Unified admin content form that saves news, announcements and events to Firestore. */
export function ContentForm({ title, defaultType = "news", documentId, collectionName, readOnly = false, initialValues }: ContentFormProps) {
  const router = useRouter();
  const [contentType, setContentType] = useState<ContentType>(initialValues?.contentType || defaultType);
  const [status, setStatus] = useState<PublishStatus>(initialValues?.status || "published");
  const [scheduledAt, setScheduledAt] = useState(dateTimeInputValue(initialValues?.scheduledAt));
  const [name, setName] = useState(initialValues?.title || "");
  const [excerpt, setExcerpt] = useState(initialValues?.excerpt || "");
  const [category, setCategory] = useState(initialValues?.category || "");
  const [content, setContent] = useState(initialValues?.content || "");
  const [coverImage, setCoverImage] = useState(initialValues?.coverImage || defaultCoverImage);
  const [location, setLocation] = useState(initialValues?.location || "");
  const [address, setAddress] = useState(initialValues?.address || "");
  const [startDate, setStartDate] = useState(dateTimeInputValue(initialValues?.startDate));
  const [endDate, setEndDate] = useState(dateTimeInputValue(initialValues?.endDate));
  const [price, setPrice] = useState(String(initialValues?.price ?? 0));
  const [capacity, setCapacity] = useState(initialValues?.capacity ? String(initialValues.capacity) : "");
  const [conditions, setConditions] = useState(initialValues?.conditions || "");
  const [saving, setSaving] = useState(false);
  const slug = useMemo(() => slugify(name), [name]);
  const isEvent = contentType === "event";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(documentId && collectionName ? `/api/admin/content/${collectionName}/${documentId}` : "/api/admin/content", {
        method: documentId && collectionName ? "PATCH" : "POST",
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
        <fieldset disabled={readOnly || saving} className="grid gap-4 disabled:opacity-90">
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
        </fieldset>
        <div className="flex gap-2">
          {!readOnly ? <Button disabled={saving || !name || !content || (status === "scheduled" && !scheduledAt) || (isEvent && (!startDate || !endDate || !location))}>{saving ? "Kaydediliyor..." : status === "published" ? "Yayınla" : status === "scheduled" ? "Zamanla" : "Taslak Kaydet"}</Button> : null}
          <Button type="button" variant="outline" onClick={() => router.back()}>
            {readOnly ? "Geri" : "İptal"}
          </Button>
        </div>
      </form>
    </section>
  );
}

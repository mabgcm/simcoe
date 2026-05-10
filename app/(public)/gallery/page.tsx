import type { Metadata } from "next";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { galleryImages } from "@/lib/demo-data";
import { getMessages, getRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  const messages = getMessages(getRequestLocale());
  return { title: messages.meta.gallery };
}

/** Public gallery page seeded with demo media. */
export default function GalleryPage() {
  const t = getMessages(getRequestLocale()).gallery;
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{t.eyebrow}</p>
      <h1 className="mt-3 font-heading text-5xl text-secondary">{t.title}</h1>
      <div className="mt-8">
        <GalleryGrid images={galleryImages} />
      </div>
    </section>
  );
}

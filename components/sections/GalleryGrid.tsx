"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

/** Gallery grid with a lightweight image lightbox. */
export function GalleryGrid({ images }: { images: string[] }) {
  const t = useTranslations("gallery");
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {images.map((src, index) => (
          <button key={src} className="relative aspect-square overflow-hidden rounded-lg border bg-white shadow-sm" onClick={() => setActive(src)} aria-label={`${t("title")} ${index + 1}`}>
            <Image src={src} alt={`${t("title")} ${index + 1}`} fill className="object-cover transition-transform hover:scale-105" sizes="(min-width: 1024px) 25vw, 50vw" />
          </button>
        ))}
      </div>
      {active ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-secondary/90 p-4">
          <Button className="absolute right-4 top-4" size="icon" variant="outline" aria-label={t("close")} onClick={() => setActive(null)}>
            <X className="h-4 w-4" />
          </Button>
          <div className="relative h-[80vh] w-full max-w-5xl">
            <Image src={active} alt={t("title")} fill className="object-contain" sizes="90vw" />
          </div>
        </div>
      ) : null}
    </>
  );
}

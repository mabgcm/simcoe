import type { Metadata } from "next";
import Image from "next/image";
import { sponsors } from "@/lib/demo-data";
import { Badge } from "@/components/ui/badge";
import { getMessages, getRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  const messages = getMessages(getRequestLocale());
  return { title: messages.meta.sponsors };
}

/** Public sponsor listing. */
export default function SponsorsPage() {
  const t = getMessages(getRequestLocale()).sponsors;
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{t.eyebrow}</p>
      <h1 className="mt-3 font-heading text-5xl text-secondary">{t.title}</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {sponsors.map((sponsor) => (
          <a key={sponsor.id} href={sponsor.websiteUrl} target="_blank" rel="noreferrer" className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-24 items-center justify-center rounded-lg bg-muted text-center font-heading text-2xl font-bold text-secondary">
              {sponsor.logoUrl ? <Image src={sponsor.logoUrl} alt={sponsor.name} width={72} height={72} className="rounded-lg" /> : sponsor.name.split(" ").map((part) => part[0]).join("")}
            </div>
            <h2 className="mt-4 font-heading text-xl text-secondary">{sponsor.name}</h2>
            <Badge className="mt-4 capitalize">{sponsor.tier}</Badge>
          </a>
        ))}
      </div>
    </section>
  );
}

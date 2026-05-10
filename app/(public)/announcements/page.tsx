export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { NewsSearch } from "@/components/news/NewsSearch";
import { MemberPostCTA } from "@/components/news/MemberPostCTA";
import { listPublishedAnnouncements } from "@/lib/content";
import { getMessages, getRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  const messages = getMessages(getRequestLocale());
  return { title: messages.meta.announcements };
}

export default async function AnnouncementsPage() {
  const locale = getRequestLocale();
  const messages = getMessages(locale);
  const articles = await listPublishedAnnouncements(locale);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{messages.announcements.eyebrow}</p>
          <h1 className="mt-3 font-heading text-5xl text-secondary">{messages.announcements.title}</h1>
        </div>
        <MemberPostCTA type="announcement" />
      </div>
      <div className="mt-8">
        <NewsSearch articles={articles} namespace="announcements" basePath="/announcements" />
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { NewsSearch } from "@/components/news/NewsSearch";
import { listPublishedNews } from "@/lib/content";
import { getMessages, getRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  const messages = getMessages(getRequestLocale());
  return { title: messages.meta.news };
}

/** News listing with search and category filters. */
export default async function NewsPage() {
  const locale = getRequestLocale();
  const messages = getMessages(locale);
  const articles = await listPublishedNews(locale);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{messages.news.eyebrow}</p>
      <h1 className="mt-3 font-heading text-5xl text-secondary">{messages.news.title}</h1>
      <div className="mt-8">
        <NewsSearch articles={articles} />
      </div>
    </section>
  );
}

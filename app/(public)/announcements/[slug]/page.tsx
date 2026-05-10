import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { CommentsSection } from "@/components/news/CommentsSection";
import { getPublishedNewsBySlug } from "@/lib/content";
import { getMessages, getRequestLocale } from "@/i18n/server";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getPublishedNewsBySlug(getRequestLocale(), params.slug);
  return { title: article?.title || "Duyuru", description: article?.excerpt };
}

export default async function AnnouncementDetailPage({ params }: { params: { slug: string } }) {
  const locale = getRequestLocale();
  const messages = getMessages(locale);
  const article = await getPublishedNewsBySlug(locale, params.slug);
  if (!article || article.contentType !== "announcement") notFound();

  const dateStr = new Intl.DateTimeFormat(locale === "en" ? "en-CA" : "tr-TR", { year: "numeric", month: "long", day: "numeric" }).format(article.publishedAt);

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{messages.announcements.eyebrow}</p>
      <h1 className="mt-3 font-heading text-5xl text-secondary">{article.title}</h1>

      <div className="mt-5 flex items-center gap-3">
        {article.authorPhotoURL ? (
          <Image src={article.authorPhotoURL} alt={article.author} width={40} height={40} className="h-10 w-10 rounded-lg object-cover" unoptimized />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
            {article.author.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-secondary">{article.author}</p>
          <p className="text-xs text-muted-foreground">{dateStr}</p>
        </div>
      </div>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg">
        <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority />
      </div>
      <div className="prose-content mt-8 rounded-lg bg-white p-6 shadow-sm" dangerouslySetInnerHTML={{ __html: article.body }} />
      <CommentsSection postId={article.id} isMemberPost={article.source === "member"} />
    </article>
  );
}

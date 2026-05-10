import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { Facebook, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNews } from "@/lib/demo-data";
import { getMessages, getRequestLocale } from "@/i18n/server";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getNews(getRequestLocale()).find((item) => item.slug === params.slug);
  return { title: article?.title || "Haber", description: article?.excerpt };
}

/** News detail page with rich content and share actions. */
export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const locale = getRequestLocale();
  const messages = getMessages(locale);
  const article = getNews(locale).find((item) => item.slug === params.slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{article.category}</p>
      <h1 className="mt-3 font-heading text-5xl text-secondary">{article.title}</h1>
      <p className="mt-4 text-muted-foreground">{new Intl.DateTimeFormat(locale === "en" ? "en-CA" : "tr-TR", { year: "numeric", month: "long", day: "numeric" }).format(article.publishedAt)} · {article.author}</p>
      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg">
        <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority />
      </div>
      <div className="mt-6 flex gap-2">
        <Button size="icon" variant="outline" aria-label={messages.news.shareFacebook}><Facebook className="h-4 w-4" /></Button>
        <Button size="icon" variant="outline" aria-label={messages.news.shareLinkedin}><Linkedin className="h-4 w-4" /></Button>
        <Button size="icon" variant="outline" aria-label={messages.news.shareEmail}><Mail className="h-4 w-4" /></Button>
      </div>
      <div className="prose-content mt-8 rounded-lg bg-white p-6 shadow-sm" dangerouslySetInnerHTML={{ __html: article.body }} />
    </article>
  );
}

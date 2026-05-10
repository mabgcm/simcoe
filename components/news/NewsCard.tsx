import Image from "next/image";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type NewsCardProps = {
  article: {
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    coverImage: string;
    publishedAt: Date;
    readMinutes?: number;
  };
  basePath?: string;
};

/** News preview card with image, category and reading metadata. */
export function NewsCard({ article, basePath = "/news" }: NewsCardProps) {
  const format = useFormatter();
  const t = useTranslations("common");
  const href = `${basePath}/${article.slug}`;

  return (
    <Card className="overflow-hidden">
      <Link href={href} aria-label={article.title}>
        <div className="relative aspect-[16/10]">
          <Image src={article.coverImage} alt={article.title} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
        </div>
      </Link>
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge>{article.category}</Badge>
          <span className="text-xs text-muted-foreground">{t("readMinutes", { minutes: article.readMinutes || 4 })}</span>
        </div>
        <Link href={href}>
          <h3 className="mt-4 font-heading text-2xl leading-tight text-secondary hover:text-primary">{article.title}</h3>
        </Link>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{article.excerpt}</p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{format.dateTime(article.publishedAt, { year: "numeric", month: "long", day: "numeric" })}</p>
      </CardContent>
    </Card>
  );
}

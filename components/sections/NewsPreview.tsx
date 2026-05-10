import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { NewsGrid } from "@/components/news/NewsGrid";
import { getNews } from "@/lib/demo-data";

/** Homepage preview of the latest published news. */
export function NewsPreview() {
  const t = useTranslations("home");
  const locale = useLocale();
  const articles = getNews(locale).slice(0, 3);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{t("newsEyebrow")}</p>
            <h2 className="mt-2 font-heading text-4xl text-secondary">{t("newsTitle")}</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/news">{t("allNews")}</Link>
          </Button>
        </div>
        <NewsGrid articles={articles} />
      </div>
    </section>
  );
}

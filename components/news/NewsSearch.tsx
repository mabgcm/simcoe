"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { NewsGrid } from "@/components/news/NewsGrid";

type Article = React.ComponentProps<typeof NewsGrid>["articles"][number];

type NewsSearchProps = {
  articles: Article[];
  namespace?: "news" | "announcements";
  basePath?: string;
};

/** Client-side Fuse.js search and category filtering for news and announcements. */
export function NewsSearch({ articles, namespace = "news", basePath }: NewsSearchProps) {
  const t = useTranslations(namespace);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const categories = ["all", ...Array.from(new Set(articles.map((item) => item.category)))];
  const fuse = useMemo(() => new Fuse(articles, { keys: ["title", "excerpt"], threshold: 0.35 }), [articles]);
  const filtered = (query ? fuse.search(query).map((result) => result.item) : articles).filter((item) => category === "all" || item.category === category);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("search")} aria-label={t("search")} />
        <Select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Kategori filtrele" className="md:w-56">
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? t("allCategories") : item}
            </option>
          ))}
        </Select>
      </div>
      <NewsGrid articles={filtered} basePath={basePath} />
    </div>
  );
}

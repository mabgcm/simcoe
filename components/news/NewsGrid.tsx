import { NewsCard } from "@/components/news/NewsCard";

type NewsGridProps = {
  articles: React.ComponentProps<typeof NewsCard>["article"][];
  basePath?: string;
};

/** Responsive grid for news cards. */
export function NewsGrid({ articles, basePath }: NewsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <NewsCard key={article.slug} article={article} basePath={basePath} />
      ))}
    </div>
  );
}

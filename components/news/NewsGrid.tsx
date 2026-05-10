import { NewsCard } from "@/components/news/NewsCard";

type NewsGridProps = {
  articles: React.ComponentProps<typeof NewsCard>["article"][];
};

/** Responsive grid for news cards. */
export function NewsGrid({ articles }: NewsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <NewsCard key={article.slug} article={article} />
      ))}
    </div>
  );
}

import { notFound } from "next/navigation";
import { getGuideEntries } from "@/lib/demo-data";
import { getMessages, getRequestLocale } from "@/i18n/server";

/** Newcomers guide category detail. */
export default function GuideCategoryPage({ params }: { params: { category: string } }) {
  const locale = getRequestLocale();
  const messages = getMessages(locale);
  const entries = getGuideEntries(locale).filter((entry) => entry.category === params.category);
  if (!entries.length) notFound();

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{messages.guide.eyebrow}</p>
      <h1 className="mt-3 font-heading text-5xl capitalize text-secondary">{messages.guide.categories[params.category as keyof typeof messages.guide.categories]}</h1>
      <div className="mt-8 grid gap-5">
        {entries.map((entry) => (
          <article key={entry.id} className="prose-content rounded-lg border bg-white p-6 shadow-sm">
            <h2>{entry.title}</h2>
            <p>{entry.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

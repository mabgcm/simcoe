import Link from "next/link";
import type { Metadata } from "next";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGuideEntries } from "@/lib/demo-data";
import { getMessages, getRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  const messages = getMessages(getRequestLocale());
  return { title: messages.nav.guide };
}

/** Newcomers guide category overview. */
export default function NewcomersGuidePage() {
  const locale = getRequestLocale();
  const messages = getMessages(locale);
  const entries = getGuideEntries(locale);
  const labels = messages.guide.categories;

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
      <aside className="h-fit rounded-lg border bg-white p-4 shadow-sm">
        {Object.entries(labels).map(([key, label]) => (
          <Link key={key} href={`/newcomers-guide/${key}`} className="block rounded-lg px-3 py-2 text-sm font-semibold text-secondary hover:bg-muted">
            {label}
          </Link>
        ))}
      </aside>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{messages.guide.eyebrow}</p>
        <h1 className="mt-3 font-heading text-5xl text-secondary">{messages.guide.title}</h1>
        <div className="mt-8 grid gap-4">
          {entries.map((entry) => (
            <article key={entry.id} className="rounded-lg border bg-white p-5 shadow-sm">
              <h2 className="font-heading text-2xl text-secondary">{entry.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{entry.content}</p>
              <Button asChild className="mt-4" variant="outline" size="sm">
                <Link href={`/newcomers-guide/${entry.category}`}>
                  <Download className="h-4 w-4" />
                  {messages.guide.open}
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

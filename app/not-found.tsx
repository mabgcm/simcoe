import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getMessages, getRequestLocale } from "@/i18n/server";

/** Friendly 404 page for missing STA content. */
export default function NotFound() {
  const t = getMessages(getRequestLocale()).notFound;
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-start justify-center px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{t.code}</p>
      <h1 className="mt-3 font-heading text-4xl text-secondary">{t.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{t.body}</p>
      <Button asChild className="mt-8">
        <Link href="/">{t.home}</Link>
      </Button>
    </section>
  );
}

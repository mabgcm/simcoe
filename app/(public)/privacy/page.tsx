import type { Metadata } from "next";
import { getMessages, getRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  const messages = getMessages(getRequestLocale());
  return { title: messages.meta.privacy };
}

/** Privacy and KVKK policy page. */
export default function PrivacyPage() {
  const t = getMessages(getRequestLocale()).legal;
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-5xl text-secondary">{t.privacyTitle}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{t.updated}</p>
      <div className="prose-content mt-8 rounded-lg border bg-white p-6 shadow-sm">
        {t.privacyBody.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </section>
  );
}

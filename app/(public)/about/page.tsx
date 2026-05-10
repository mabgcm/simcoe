import type { Metadata } from "next";
import Image from "next/image";
import { boardMembers } from "@/lib/demo-data";
import { getMessages, getRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  const messages = getMessages(getRequestLocale());
  return { title: messages.meta.about };
}

/** About page describing the association mission. */
export default function AboutPage() {
  const locale = getRequestLocale();
  const t = getMessages(locale).about;

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{t.eyebrow}</p>
      <h1 className="mt-3 font-heading text-5xl text-secondary">{t.title}</h1>
      <div className="prose-content mt-8 rounded-lg bg-white p-6 shadow-sm">
        <p>{t.intro}</p>
        <h2>{t.missionTitle}</h2>
        <p>{t.mission}</p>
        <h2>{t.visionTitle}</h2>
        <p>{t.vision}</p>
        <h2>{t.valuesTitle}</h2>
        <ul>{t.values.map((value) => <li key={value}>{value}</li>)}</ul>
        <h2>{t.historyTitle}</h2>
        <p>{t.history}</p>
      </div>
      <div className="mt-10">
        <h2 className="font-heading text-3xl text-secondary">{t.boardTitle}</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {boardMembers.map((member) => (
            <article key={member.name} className="rounded-lg border bg-white p-4 shadow-sm">
              <Image src={member.photo} alt={member.name} width={360} height={280} className="aspect-[4/3] rounded-lg object-cover" />
              <h3 className="mt-3 font-heading text-xl text-secondary">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.getRole(locale)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

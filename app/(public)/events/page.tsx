import type { Metadata } from "next";
import { EventCalendar } from "@/components/events/EventCalendar";
import { listEvents } from "@/lib/content";
import { getMessages, getRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  const messages = getMessages(getRequestLocale());
  return { title: messages.meta.events };
}

/** Events page with list and calendar modes. */
export default async function EventsPage() {
  const locale = getRequestLocale();
  const messages = getMessages(locale);
  const events = await listEvents(locale);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{messages.events.eyebrow}</p>
      <h1 className="mt-3 font-heading text-5xl text-secondary">{messages.events.title}</h1>
      <div className="mt-8">
        <EventCalendar events={events} />
      </div>
    </section>
  );
}

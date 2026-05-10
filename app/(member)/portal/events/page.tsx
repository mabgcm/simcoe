import type { Metadata } from "next";
import { getEvents } from "@/lib/demo-data";
import { EventCard } from "@/components/events/EventCard";
import { getMessages, getRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  const messages = getMessages(getRequestLocale());
  return { title: messages.portal.events };
}

/** Member portal events route. */
export default function PortalEventsPage() {
  const locale = getRequestLocale();
  const messages = getMessages(locale);
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-5xl text-secondary">{messages.portal.events}</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {getEvents(locale).map((event) => <EventCard key={event.id} event={event} />)}
      </div>
    </section>
  );
}

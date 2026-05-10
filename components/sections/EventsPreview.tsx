import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/EventCard";
import { getEvents } from "@/lib/demo-data";

/** Homepage preview of upcoming events. */
export function EventsPreview() {
  const t = useTranslations("home");
  const locale = useLocale();
  const events = getEvents(locale).slice(0, 3);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{t("eventsEyebrow")}</p>
            <h2 className="mt-2 font-heading text-4xl text-secondary">{t("eventsTitle")}</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/events">{t("allEvents")}</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}

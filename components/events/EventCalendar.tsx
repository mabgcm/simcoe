"use client";

import { useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { enCA, tr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/EventCard";

const locales = { tr, en: enCA };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

type CalendarEvent = React.ComponentProps<typeof EventCard>["event"] & { endDate: Date };

/** Toggleable event calendar and list view. */
export function EventCalendar({ events }: { events: CalendarEvent[] }) {
  const locale = useLocale();
  const t = useTranslations("events");
  const [view, setView] = useState<"list" | "calendar">("list");
  const calendarEvents = useMemo(() => events.map((event) => ({ title: event.title, start: event.startDate, end: event.endDate, resource: event })), [events]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")}>
          {t("list")}
        </Button>
        <Button variant={view === "calendar" ? "default" : "outline"} onClick={() => setView("calendar")}>
          {t("calendar")}
        </Button>
      </div>
      {view === "calendar" ? (
        <div className="h-[620px] rounded-lg border bg-white p-4">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            culture={locale === "en" ? "en" : "tr"}
            messages={{
              today: t("calendarMessages.today"),
              previous: t("calendarMessages.previous"),
              next: t("calendarMessages.next"),
              month: t("calendarMessages.month"),
              week: t("calendarMessages.week"),
              day: t("calendarMessages.day"),
              agenda: t("calendarMessages.agenda"),
              date: t("calendarMessages.date"),
              time: t("calendarMessages.time"),
              event: t("calendarMessages.event"),
              noEventsInRange: t("calendarMessages.noEvents")
            }}
          />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

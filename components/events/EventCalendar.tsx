"use client";

import { useCallback, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { endOfWeek, format, getDay, parse, startOfWeek } from "date-fns";
import { enCA, tr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/EventCard";
import { cn } from "@/lib/utils/cn";

const locales = { tr, en: enCA };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

type CalEvent = React.ComponentProps<typeof EventCard>["event"] & { endDate: Date };
type RbcEvent = { title: string; start: Date; end: Date; resource: CalEvent };

const CALENDAR_VIEWS: View[] = ["month", "week", "day"];

export function EventCalendar({ events }: { events: CalEvent[] }) {
  const locale = useLocale();
  const t = useTranslations("events");
  const router = useRouter();
  const dfLocale = locale === "en" ? enCA : tr;

  const [mode, setMode] = useState<"list" | "calendar">("list");
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());

  const rbcEvents: RbcEvent[] = useMemo(
    () => events.map((e) => ({ title: e.title, start: e.startDate, end: e.endDate, resource: e })),
    [events]
  );

  const handleSelectEvent = useCallback(
    (event: RbcEvent) => router.push(`/events/${event.resource.slug}`),
    [router]
  );

  const handleNavigate = useCallback((newDate: Date) => setDate(newDate), []);
  const handleView = useCallback((newView: View) => setView(newView), []);

  function navigate(direction: "PREV" | "NEXT" | "TODAY") {
    if (direction === "TODAY") { setDate(new Date()); return; }
    const delta = direction === "NEXT" ? 1 : -1;
    setDate((prev) => {
      const d = new Date(prev);
      if (view === "month" || view === "agenda") d.setMonth(d.getMonth() + delta);
      else if (view === "week") d.setDate(d.getDate() + delta * 7);
      else if (view === "day") d.setDate(d.getDate() + delta);
      return d;
    });
  }

  const dateLabel = useMemo(() => {
    if (view === "week") {
      const ws = startOfWeek(date, { locale: dfLocale });
      const we = endOfWeek(date, { locale: dfLocale });
      return `${format(ws, "d MMM", { locale: dfLocale })} – ${format(we, "d MMM yyyy", { locale: dfLocale })}`;
    }
    if (view === "day") return format(date, "d MMMM yyyy, EEEE", { locale: dfLocale });
    return format(date, "MMMM yyyy", { locale: dfLocale });
  }, [date, view, dfLocale]);

  const viewLabel: Record<string, string> = {
    month: t("calendarMessages.month"),
    week: t("calendarMessages.week"),
    day: t("calendarMessages.day"),
    agenda: t("calendarMessages.agenda"),
  };

  const eventPropGetter = useCallback(() => ({ className: "sta-event" }), []);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button variant={mode === "list" ? "default" : "outline"} onClick={() => setMode("list")}>{t("list")}</Button>
        <Button variant={mode === "calendar" ? "default" : "outline"} onClick={() => setMode("calendar")}>{t("calendar")}</Button>
      </div>

      {mode === "calendar" ? (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          {/* Custom toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" onClick={() => navigate("PREV")} aria-label={t("calendarMessages.previous")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="px-3 text-xs font-semibold uppercase tracking-wide" onClick={() => navigate("TODAY")}>
                {t("calendarMessages.today")}
              </Button>
              <Button size="icon" variant="ghost" onClick={() => navigate("NEXT")} aria-label={t("calendarMessages.next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <span className="font-heading text-lg font-semibold capitalize text-secondary">{dateLabel}</span>

            <div className="flex gap-1 rounded-lg border bg-muted/40 p-1">
              {CALENDAR_VIEWS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
                    view === v ? "bg-primary text-white shadow-sm" : "text-secondary hover:bg-white"
                  )}
                >
                  {viewLabel[v]}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar body */}
          <div className="sta-calendar p-3" style={{ height: 620 }}>
            <Calendar
              localizer={localizer}
              events={rbcEvents}
              startAccessor="start"
              endAccessor="end"
              culture={locale === "en" ? "en" : "tr"}
              view={view}
              onView={handleView}
              date={date}
              onNavigate={handleNavigate}
              toolbar={false}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventPropGetter}
              length={31}
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
                noEventsInRange: t("calendarMessages.noEvents"),
              }}
            />
          </div>
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

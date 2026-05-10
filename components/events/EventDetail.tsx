import Image from "next/image";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type EventDetailProps = {
  event: {
    title: string;
    location: string;
    address: string;
    startDate: Date;
    endDate: Date;
    coverImage: string;
    price: number;
    capacity: number | null;
  };
};

/** Full event detail surface with registration action. */
export function EventDetail({ event }: EventDetailProps) {
  const t = useTranslations("events");
  const format = useFormatter();

  return (
    <article>
      <div className="relative h-[48vh] min-h-[360px]">
        <Image src={event.coverImage} alt={event.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-secondary/55" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-5xl px-4 pb-10 text-white">
          <h1 className="font-heading text-4xl md:text-6xl">{event.title}</h1>
        </div>
      </div>
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[1fr_320px]">
        <div className="prose-content rounded-lg bg-white p-6 shadow-sm">
          <h2>{t("detailTitle")}</h2>
          <p>{t("detailBody")}</p>
          <h2>{t("conditions")}</h2>
          <p>{t("conditionsBody")}</p>
          <div className="mt-6 aspect-video overflow-hidden rounded-lg border">
            <iframe title={`${event.title} konumu`} src={`https://www.google.com/maps?q=${encodeURIComponent(event.address)}&output=embed`} className="h-full w-full" loading="lazy" />
          </div>
        </div>
        <aside className="h-fit rounded-lg border bg-white p-6 shadow-sm">
          <div className="grid gap-4 text-sm text-muted-foreground">
            <span className="flex gap-3">
              <CalendarDays className="h-5 w-5 text-primary" />
              {format.dateTime(event.startDate, { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })} - {format.dateTime(event.endDate, { hour: "2-digit", minute: "2-digit" })}
            </span>
            <span className="flex gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              {event.location}
            </span>
            <span className="flex gap-3">
              <Users className="h-5 w-5 text-primary" />
              {event.capacity ? t("capacity", { count: event.capacity }) : t("openCapacity")}
            </span>
          </div>
          <Button className="mt-6 w-full">{event.price === 0 ? t("registerFree") : t("registerPaid")}</Button>
        </aside>
      </div>
    </article>
  );
}

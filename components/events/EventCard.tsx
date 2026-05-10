import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type EventCardProps = {
  event: {
    title: string;
    slug: string;
    location: string;
    startDate: Date;
    coverImage: string;
    category: string;
    price: number;
  };
};

/** Event card used in public listings and previews. */
export function EventCard({ event }: EventCardProps) {
  const format = useFormatter();
  const t = useTranslations("common");

  return (
    <Link href={`/events/${event.slug}`} className="block">
      <Card className="overflow-hidden">
        <div className="relative aspect-[16/9]">
          <Image src={event.coverImage} alt={event.title} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
          <Badge className="absolute left-4 top-4 bg-white">{event.category}</Badge>
        </div>
        <CardContent className="p-5">
          <h3 className="font-heading text-2xl text-secondary hover:text-primary">{event.title}</h3>
          <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              {format.dateTime(event.startDate, { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {event.location}
            </span>
          </div>
          <p className="mt-4 text-sm font-semibold text-secondary">{event.price === 0 ? t("free") : t("cad", { amount: event.price })}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

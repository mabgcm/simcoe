import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventDetail } from "@/components/events/EventDetail";
import { getEvents } from "@/lib/demo-data";
import { getRequestLocale } from "@/i18n/server";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const event = getEvents(getRequestLocale()).find((item) => item.slug === params.slug);
  return { title: event?.title || "Event" };
}

/** Event detail route. */
export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = getEvents(getRequestLocale()).find((item) => item.slug === params.slug);
  if (!event) notFound();
  return <EventDetail event={event} />;
}

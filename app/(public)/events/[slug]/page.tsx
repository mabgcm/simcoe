import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventDetail } from "@/components/events/EventDetail";
import { getEventBySlug } from "@/lib/content";
import { getRequestLocale } from "@/i18n/server";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = await getEventBySlug(getRequestLocale(), params.slug);
  return { title: event?.title || "Event" };
}

/** Event detail route. */
export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = await getEventBySlug(getRequestLocale(), params.slug);
  if (!event) notFound();
  return <EventDetail event={event} />;
}

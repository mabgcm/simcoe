"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { MemberCard } from "@/components/member/MemberCard";
import { EventCard } from "@/components/events/EventCard";
import { getEvents } from "@/lib/demo-data";

/** Member portal overview with plan, status and joined events. */
export function PortalOverview() {
  const t = useTranslations("portal");
  const locale = useLocale();
  const events = getEvents(locale).slice(0, 2);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="font-heading text-5xl text-secondary">{t("title")}</h1>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline"><Link href="/portal/profile">{t("profile")}</Link></Button>
          <Button asChild variant="outline"><Link href="/portal/events">{t("events")}</Link></Button>
          <Button asChild><Link href="/portal/posts">Gönderilerim</Link></Button>
        </div>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <MemberCard name="STA Member" status="pending" />
        <div>
          <div className="grid gap-4 rounded-lg border bg-white p-5 shadow-sm sm:grid-cols-2">
            <div><p className="text-sm text-muted-foreground">{t("activePlan")}</p><p className="mt-1 text-xl font-bold text-secondary">Individual</p></div>
            <div><p className="text-sm text-muted-foreground">{t("memberStatus")}</p><p className="mt-1 text-xl font-bold text-primary">pending_payment</p></div>
          </div>
          <h2 className="mt-8 font-heading text-3xl text-secondary">{t("joinedEvents")}</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {events.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/sections/HeroSection";
import { NewsPreview } from "@/components/sections/NewsPreview";
import { EventsPreview } from "@/components/sections/EventsPreview";
import { DonateCallout } from "@/components/sections/DonateCallout";
import { SponsorsCarousel } from "@/components/sections/SponsorsCarousel";
import { getMessages, getRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  const messages = getMessages(getRequestLocale());
  return { title: messages.meta.home, description: messages.meta.description };
}

/** Public homepage with STA sections in the requested order. */
export default function HomePage() {
  const t = getMessages(getRequestLocale()).home;
  return (
    <>
      <HeroSection />
      <NewsPreview />
      <EventsPreview />
      <section className="bg-secondary py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{t.guideEyebrow}</p>
            <h2 className="mt-2 font-heading text-4xl">{t.guideTitle}</h2>
            <p className="mt-3 max-w-2xl text-white/75">{t.guideText}</p>
          </div>
          <Button asChild variant="accent">
            <Link href="/newcomers-guide">{t.guideButton}</Link>
          </Button>
        </div>
      </section>
      <DonateCallout />
      <SponsorsCarousel />
    </>
  );
}

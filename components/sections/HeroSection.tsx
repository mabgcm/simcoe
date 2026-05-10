import Link from "next/link";
import { CalendarDays, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

/** Full-viewport public hero for the association brand and primary actions. */
export function HeroSection() {
  const t = useTranslations("home");
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-secondary">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/75 to-secondary/20" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">{t("eyebrow")}</p>
          <h1 className="mt-5 font-heading text-5xl leading-[1.02] md:text-7xl">{t("title")}</h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-white/85">{t("subtitle")}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/membership">
                <UserPlus className="h-5 w-5" />
                {t("join")}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white bg-white/10 text-white hover:bg-white hover:text-secondary">
              <Link href="/events">
                <CalendarDays className="h-5 w-5" />
                {t("events")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

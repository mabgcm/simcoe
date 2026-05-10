import Image from "next/image";
import { useTranslations } from "next-intl";
import { sponsors } from "@/lib/demo-data";

/** Lightweight sponsor carousel using CSS marquee animation. */
export function SponsorsCarousel() {
  const t = useTranslations("home");
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{t("sponsorsEyebrow")}</p>
            <h2 className="mt-2 font-heading text-3xl text-secondary">{t("sponsorsTitle")}</h2>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border bg-muted py-5">
          <div className="flex min-w-max animate-[marquee_24s_linear_infinite] gap-4 px-4">
            {[...sponsors, ...sponsors].map((sponsor, index) => (
              <a key={`${sponsor.id}-${index}`} href={sponsor.websiteUrl} target="_blank" rel="noreferrer" className="flex h-20 w-56 items-center justify-center gap-3 rounded-lg bg-white px-4 text-center font-heading text-xl font-bold text-secondary shadow-sm">
                <Image src={sponsor.logoUrl} alt={sponsor.name} width={40} height={40} className="rounded-md" />
                <span>{sponsor.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

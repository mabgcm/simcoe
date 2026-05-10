"use client";

import { useState } from "react";
import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const amounts = [10, 25, 50, 100];

/** Donation callout with quick amount selector. */
export function DonateCallout() {
  const [selected, setSelected] = useState(25);
  const t = useTranslations("home");
  return (
    <section className="bg-primary py-16 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">{t("donateEyebrow")}</p>
          <h2 className="mt-2 font-heading text-4xl">{t("donateTitle")}</h2>
          <p className="mt-4 max-w-2xl text-lg text-white/85">{t("donateText")}</p>
        </div>
        <div className="rounded-lg bg-white p-5 text-secondary shadow-soft">
          <div className="grid grid-cols-4 gap-2">
            {amounts.map((amount) => (
              <Button key={amount} variant={selected === amount ? "default" : "outline"} onClick={() => setSelected(amount)} aria-label={`$${amount}`}>
                ${amount}
              </Button>
            ))}
          </div>
          <Button asChild className="mt-4 w-full" variant="secondary">
            <Link href={`/donate?amount=${selected}`}>
              <HeartHandshake className="h-5 w-5" />
              {t("donateButton")}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const planTypes = ["individual", "family", "student", "corporate"] as const;

/** Membership plan grid that links registration with selected plan. */
export function MembershipPlans() {
  const t = useTranslations("membership");

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{t("eyebrow")}</p>
      <h1 className="mt-3 font-heading text-5xl text-secondary">{t("title")}</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {planTypes.map((type) => (
          <Card key={type}>
            <CardContent className="p-6">
              <h2 className="font-heading text-3xl text-secondary">{t(`plans.${type}.name`)}</h2>
              <p className="mt-3 text-4xl font-bold text-primary">
                ${t(`plans.${type}.price`)}
                <span className="text-base text-muted-foreground">{t("perYear")}</span>
              </p>
              <ul className="mt-5 grid gap-3 text-sm text-muted-foreground">
                {t.raw(`plans.${type}.perks`).map((perk: string) => (
                  <li key={perk} className="flex gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    {perk}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6 w-full">
                <Link href={`/register?plan=${type}`}>{t("join")}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

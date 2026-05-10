import { Suspense } from "react";
import type { Metadata } from "next";
import { DonateForm } from "@/components/sections/DonateForm";
import { getMessages, getRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  const messages = getMessages(getRequestLocale());
  return { title: messages.meta.donate };
}

/** Donation form with one-time and recurring Stripe checkout. */
export default function DonatePage() {
  const messages = getMessages(getRequestLocale());
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{messages.donate.eyebrow}</p>
      <h1 className="mt-3 font-heading text-5xl text-secondary">{messages.donate.title}</h1>
      <Suspense fallback={<div className="mt-8 h-96 rounded-lg bg-muted" />}>
        <DonateForm />
      </Suspense>
    </section>
  );
}

import type { Metadata } from "next";
import { Facebook, Instagram, Mail, MapPin, Twitter, Youtube } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { getMessages, getRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  const messages = getMessages(getRequestLocale());
  return { title: messages.meta.contact };
}

const socialLinks = [
  { href: process.env.NEXT_PUBLIC_FACEBOOK_URL, label: "Facebook", icon: Facebook },
  { href: process.env.NEXT_PUBLIC_INSTAGRAM_URL, label: "Instagram", icon: Instagram },
  { href: process.env.NEXT_PUBLIC_TWITTER_URL, label: "Twitter", icon: Twitter },
  { href: process.env.NEXT_PUBLIC_YOUTUBE_URL, label: "YouTube", icon: Youtube }
].filter((item) => item.href);

/** Public contact page with form and association contact details. */
export default function ContactPage() {
  const messages = getMessages(getRequestLocale());
  const t = messages.contact;
  const contactEmail = process.env.STA_CONTACT_EMAIL || "info@simcoeturkish.org";

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{t.eyebrow}</p>
        <h1 className="mt-3 font-heading text-5xl text-secondary">{t.title}</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{t.intro}</p>
        <div className="mt-8"><ContactForm /></div>
      </div>
      <aside className="h-fit rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="font-heading text-2xl text-secondary">{t.infoTitle}</h2>
        <div className="mt-5 grid gap-4 text-sm text-muted-foreground">
          <span className="flex gap-3"><Mail className="h-5 w-5 text-primary" />{contactEmail}</span>
          <span className="flex gap-3"><MapPin className="h-5 w-5 text-primary" />{t.location}</span>
        </div>
        {socialLinks.length ? (
          <div className="mt-6 flex gap-2">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-lg border text-secondary hover:bg-muted" aria-label={item.label}>
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        ) : null}
      </aside>
    </section>
  );
}

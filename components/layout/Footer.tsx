"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/hooks/useAuth";

const socialLinks = [
  { href: process.env.NEXT_PUBLIC_FACEBOOK_URL, label: "Facebook", icon: Facebook },
  { href: process.env.NEXT_PUBLIC_INSTAGRAM_URL, label: "Instagram", icon: Instagram },
  { href: process.env.NEXT_PUBLIC_TWITTER_URL, label: "Twitter", icon: Twitter },
  { href: process.env.NEXT_PUBLIC_YOUTUBE_URL, label: "YouTube", icon: Youtube }
].filter((item) => item.href);

/** Footer with core association links and contact details. */
export function Footer() {
  const t = useTranslations("footer");
  const navT = useTranslations("nav");
  const metaT = useTranslations("meta");
  const locale = useLocale();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function loadRole() {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const snapshot = await getDoc(doc(db, "users", user.uid));
      const role = snapshot.data()?.role;
      setIsAdmin(role === "admin" || role === "super_admin");
    }
    void loadRole();
  }, [user]);

  async function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    try {
      await setDoc(doc(db, "newsletter", email.trim().toLowerCase()), {
        email: email.trim().toLowerCase(),
        locale,
        createdAt: serverTimestamp()
      });
      setEmail("");
      toast.success(t("newsletterSuccess"));
    } catch {
      toast.error(t("newsletterError"));
    }
  }

  return (
    <footer className="border-t bg-secondary text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <h2 className="font-heading text-2xl">Simcoe Turkish Association</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/75">{t("tagline")}</p>
          <form className="mt-5 flex max-w-md gap-2" onSubmit={subscribe}>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder={t("newsletterPlaceholder")} className="border-white/20 bg-white text-secondary" />
            <Button>{t("newsletterButton")}</Button>
          </form>
          {socialLinks.length ? (
            <div className="mt-4 flex gap-2">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/80 hover:bg-white hover:text-secondary" aria-label={item.label}>
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">{t("platform")}</h3>
          <div className="mt-3 grid gap-2 text-sm">
            <Link href="/news">{navT("news")}</Link>
            <Link href="/events">{navT("events")}</Link>
            <Link href="/sponsors">{metaT("sponsors")}</Link>
            <Link href="/gallery">{metaT("gallery")}</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">{t("members")}</h3>
          <div className="mt-3 grid gap-2 text-sm">
            <Link href="/membership">{navT("membership")}</Link>
            <Link href="/portal">{t("portal")}</Link>
            {isAdmin ? <Link href="/admin">{t("admin")}</Link> : null}
          </div>
          <h3 className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-white/60">{t("legal")}</h3>
          <div className="mt-3 grid gap-2 text-sm">
            <Link href="/privacy">{t("privacy")}</Link>
            <Link href="/terms">{t("terms")}</Link>
            <Link href="/contact">{t("contact")}</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/60">{t("copyright")}</div>
    </footer>
  );
}

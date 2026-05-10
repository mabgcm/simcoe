"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/firebase/auth";
import { localizePath } from "@/i18n/config";

type MobileNavProps = {
  links: { href: string; label: string }[];
  children: React.ReactNode;
};

/** Slide-down mobile navigation menu. */
export function MobileNav({ links, children }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

  async function handleLogout() {
    await logout();
    await fetch("/api/auth/logout", { method: "POST" });
    setOpen(false);
    router.replace(localizePath("/", locale === "en" ? "en" : "tr"));
    router.refresh();
  }

  return (
    <div className="lg:hidden">
      <div onClick={() => setOpen(true)}>{children}</div>
      {open ? (
        <div className="fixed inset-0 z-50 bg-white px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="font-heading text-xl font-bold text-secondary">STA</span>
            <Button variant="ghost" size="icon" aria-label={t("closeMenu")} onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="mt-8 grid gap-2" aria-label="Mobile navigation">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-lg px-3 py-3 text-lg font-semibold text-secondary hover:bg-muted" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 grid gap-3">
            <LanguageSwitcher />
            {user ? (
              <>
                <p className="rounded-lg bg-muted px-3 py-2 text-sm font-semibold text-secondary">{t("welcome", { name: displayName })}</p>
                <Button variant="outline" onClick={handleLogout}>{t("logout")}</Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    {t("login")}
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    {t("register")}
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

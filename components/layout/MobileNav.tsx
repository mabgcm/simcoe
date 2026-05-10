"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  async function handleLogout() {
    await logout();
    await fetch("/api/auth/logout", { method: "POST" });
    setOpen(false);
    router.replace(localizePath("/", locale === "en" ? "en" : "tr"));
    router.refresh();
  }

  const menu = (
    <div className="fixed inset-0 z-[100] h-dvh w-screen overflow-y-auto bg-white px-4 py-4 text-secondary shadow-xl">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src="/images/logo.png"
            alt={t("logoAlt")}
            width={104}
            height={72}
            className="shrink-0 rounded-lg object-contain"
            style={{ width: "104px", height: "72px" }}
          />
          <span className="min-w-0 font-heading text-lg font-bold leading-tight text-secondary">{t("brandName")}</span>
        </div>
        <Button variant="ghost" size="icon" aria-label={t("closeMenu")} onClick={() => setOpen(false)} className="shrink-0">
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="mx-auto mt-8 max-w-md">
        <nav className="grid gap-1" aria-label="Mobile navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg px-3 py-3 text-lg font-semibold text-secondary hover:bg-muted" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 grid gap-3 border-t pt-6">
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
    </div>
  );

  return (
    <div className="lg:hidden">
      <div onClick={() => setOpen(true)}>{children}</div>
      {mounted && open ? createPortal(menu, document.body) : null}
    </div>
  );
}

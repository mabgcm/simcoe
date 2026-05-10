"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, UserRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/MobileNav";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { logout } from "@/lib/firebase/auth";
import { useAuth } from "@/hooks/useAuth";
import { localizePath } from "@/i18n/config";

/** Main responsive site navigation. */
export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const links = [
    { href: "/about", label: t("about") },
    { href: "/news", label: t("news") },
    { href: "/events", label: t("events") },
    { href: "/newcomers-guide", label: t("guide") },
    { href: "/membership", label: t("membership") },
    { href: "/donate", label: t("donate") }
  ];

  async function handleLogout() {
    await logout();
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace(localizePath("/", locale === "en" ? "en" : "tr"));
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label={t("homeLabel")}>
          <Image src="/images/logo.png" alt={t("logoAlt")} width={44} height={44} className="h-11 w-11 rounded-lg object-contain" priority />
          <span className="hidden max-w-[280px] font-heading text-xl font-bold leading-tight text-secondary sm:block">{t("brandName")}</span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-semibold text-secondary transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          {user ? (
            <>
              <span className="text-sm font-semibold text-secondary">{t("welcome", { name: displayName })}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                {t("logout")}
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">
                  <UserRound className="h-4 w-4" />
                  {t("login")}
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">{t("register")}</Link>
              </Button>
            </>
          )}
        </div>
        <MobileNav links={links}>
          <Button variant="ghost" size="icon" aria-label={t("openMenu")}>
            <Menu className="h-5 w-5" />
          </Button>
        </MobileNav>
      </div>
    </header>
  );
}

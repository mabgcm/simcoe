"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { localeCookieName, localizePath, type AppLocale } from "@/i18n/config";
import { cn } from "@/lib/utils/cn";

/** Route-aware TR/EN language switcher. */
export function LanguageSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const query = searchParams.toString();

  function hrefFor(targetLocale: AppLocale) {
    const path = localizePath(pathname, targetLocale);
    return query ? `${path}?${query}` : path;
  }

  function switchLocale(targetLocale: AppLocale) {
    document.cookie = `${localeCookieName}=${targetLocale}; path=/; max-age=31536000; samesite=lax`;
    window.location.assign(hrefFor(targetLocale));
  }

  return (
    <div className="flex items-center rounded-lg border bg-white p-1" aria-label="Language">
      <button type="button" className={cn("rounded-md px-1.5 py-1 text-lg leading-none", locale === "tr" ? "bg-primary/10 ring-1 ring-primary/30" : "opacity-60 hover:opacity-100")} onClick={() => switchLocale("tr")} aria-label="Türkçe">
        🇹🇷
      </button>
      <button type="button" className={cn("rounded-md px-1.5 py-1 text-lg leading-none", locale === "en" ? "bg-primary/10 ring-1 ring-primary/30" : "opacity-60 hover:opacity-100")} onClick={() => switchLocale("en")} aria-label="English">
        🇨🇦
      </button>
    </div>
  );
}

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
    <div className="flex items-center rounded-lg border bg-white p-1 text-xs font-bold" aria-label="Language">
      <button type="button" className={cn("rounded-md px-2 py-1", locale === "tr" ? "bg-primary text-white" : "text-secondary")} onClick={() => switchLocale("tr")}>
        TR
      </button>
      <button type="button" className={cn("rounded-md px-2 py-1", locale === "en" ? "bg-primary text-white" : "text-secondary")} onClick={() => switchLocale("en")}>
        EN
      </button>
    </div>
  );
}

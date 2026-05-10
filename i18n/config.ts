export const locales = ["tr", "en"] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "tr";
export const localeCookieName = "STA_LOCALE";

export function isLocale(value: string | undefined): value is AppLocale {
  return value === "tr" || value === "en";
}

export function getPathLocale(pathname: string): AppLocale | null {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : null;
}

export function stripLocalePrefix(pathname: string) {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3) || "/";
  return pathname;
}

export function localizePath(pathname: string, locale: AppLocale) {
  const cleanPath = stripLocalePrefix(pathname);
  if (locale === "tr") return cleanPath;
  return cleanPath === "/" ? "/en" : `/en${cleanPath}`;
}

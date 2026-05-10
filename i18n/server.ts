import { cookies, headers } from "next/headers";
import { defaultLocale, isLocale, localeCookieName, type AppLocale } from "@/i18n/config";
import trMessages from "@/messages/tr.json";
import enMessages from "@/messages/en.json";

export function getRequestLocale(): AppLocale {
  const headerLocale = headers().get("x-sta-locale");
  if (isLocale(headerLocale || undefined)) return headerLocale as AppLocale;
  const cookieLocale = cookies().get(localeCookieName)?.value;
  return isLocale(cookieLocale) ? cookieLocale : defaultLocale;
}

export function getMessages(locale: AppLocale) {
  return locale === "en" ? enMessages : trMessages;
}

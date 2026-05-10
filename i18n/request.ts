import { getRequestConfig } from "next-intl/server";
import { getMessages, getRequestLocale } from "@/i18n/server";

export default getRequestConfig(async () => {
  const locale = getRequestLocale();
  return {
    locale,
    messages: getMessages(locale)
  };
});

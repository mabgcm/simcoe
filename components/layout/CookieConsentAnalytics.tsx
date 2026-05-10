"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const consentKey = "sta_cookie_consent";

/** Cookie consent banner that mounts analytics only after consent. */
export function CookieConsentAnalytics() {
  const t = useTranslations("cookie");
  const [accepted, setAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    setAccepted(localStorage.getItem(consentKey) === "accepted");
  }, []);

  function accept() {
    localStorage.setItem(consentKey, "accepted");
    setAccepted(true);
  }

  return (
    <>
      {accepted ? (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      ) : null}
      {accepted === false ? (
        <div className="fixed bottom-4 left-4 right-4 z-[60] mx-auto flex max-w-3xl flex-col gap-3 rounded-lg border bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-secondary">{t("text")}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">{t("preferences")}</Button>
            <Button size="sm" onClick={accept}>{t("accept")}</Button>
          </div>
        </div>
      ) : null}
    </>
  );
}

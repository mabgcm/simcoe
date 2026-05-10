"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/** Interactive donation amount, interval and checkout form. */
export function DonateForm() {
  const t = useTranslations("donate");
  const searchParams = useSearchParams();
  const [amount, setAmount] = useState(Number(searchParams.get("amount")) || 25);
  const [interval, setInterval] = useState<"once" | "month" | "year">("once");

  async function checkout() {
    const response = await fetch("/api/donate/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, interval, donorName: "STA Supporter", donorEmail: "supporter@example.com" })
    });
    const data = (await response.json()) as { url?: string };
    if (data.url) window.location.href = data.url;
  }

  return (
    <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
      <div className="grid grid-cols-4 gap-2">
        {[10, 25, 50, 100].map((value) => (
          <Button key={value} variant={amount === value ? "default" : "outline"} onClick={() => setAmount(value)}>
            ${value}
          </Button>
        ))}
      </div>
      <Input className="mt-4" type="number" min={1} value={amount} onChange={(event) => setAmount(Number(event.target.value))} aria-label={t("customAmount")} />
      <div className="mt-4 grid grid-cols-3 gap-2">
        {(["once", "month", "year"] as const).map((value) => (
          <Button key={value} variant={interval === value ? "secondary" : "outline"} onClick={() => setInterval(value)}>
            {value === "once" ? t("once") : value === "month" ? t("month") : t("year")}
          </Button>
        ))}
      </div>
      <div className="mt-4 grid gap-3">
        <Input placeholder={t("name")} />
        <Input placeholder={t("email")} type="email" />
        <Textarea placeholder={t("message")} />
      </div>
      <Button className="mt-5 w-full" onClick={checkout}>
        {t("button")}
      </Button>
    </div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PaymentMethodSelector, type PaymentMethod } from "@/components/ui/PaymentMethodSelector";

const PRESET_AMOUNTS = [10, 25, 50, 100];

/** Interactive donation amount, interval and payment-method form. */
export function DonateForm() {
  const t = useTranslations("donate");
  const searchParams = useSearchParams();
  const [amount, setAmount] = useState(Number(searchParams.get("amount")) || 25);
  const [interval, setInterval] = useState<"once" | "month" | "year">("once");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [loading, setLoading] = useState(false);

  async function checkout() {
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/donate/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, interval, donorName: name.trim(), donorEmail: email.trim() })
      });
      const data = await response.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Ödeme sayfası açılamadı. Lütfen tekrar deneyin.");
      }
    } catch {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  const interacNote = `${t("amount")}: $${amount} CAD${interval !== "once" ? ` (${interval === "month" ? t("month") : t("year")})` : ""}`;

  return (
    <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
      {/* Amount presets */}
      <div className="grid grid-cols-4 gap-2">
        {PRESET_AMOUNTS.map((value) => (
          <Button key={value} variant={amount === value ? "default" : "outline"} onClick={() => setAmount(value)}>
            ${value}
          </Button>
        ))}
      </div>
      <Input
        className="mt-3"
        type="number"
        min={1}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        aria-label={t("customAmount")}
      />

      {/* Interval */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {(["once", "month", "year"] as const).map((v) => (
          <Button key={v} variant={interval === v ? "secondary" : "outline"} onClick={() => setInterval(v)}>
            {v === "once" ? t("once") : v === "month" ? t("month") : t("year")}
          </Button>
        ))}
      </div>

      {/* Donor info */}
      <div className="mt-5 grid gap-3">
        <Input
          placeholder={t("name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          placeholder={t("email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Textarea
          placeholder={t("message")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* Payment method */}
      <div className="mt-5">
        <PaymentMethodSelector value={method} onChange={setMethod} interacNote={interacNote} />
      </div>

      {/* Action */}
      {method === "card" && (
        <Button
          className="mt-5 w-full"
          onClick={checkout}
          disabled={loading || !name.trim() || !email.trim() || amount < 1}
        >
          {loading ? "Yönlendiriliyor..." : `${t("button")} — $${amount} CAD`}
        </Button>
      )}
    </div>
  );
}

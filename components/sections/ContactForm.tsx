"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/** Contact form that sends messages through the Resend API route. */
export function ContactForm() {
  const t = useTranslations("contact");
  const common = useTranslations("common");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form))
    });
    setLoading(false);
    if (response.ok) {
      event.currentTarget.reset();
      toast.success(t("success"));
    } else {
      toast.error(t("error"));
    }
  }

  return (
    <form className="grid gap-4 rounded-lg border bg-white p-6 shadow-sm" onSubmit={submit}>
      <Input name="name" placeholder={common("name")} required />
      <Input name="email" type="email" placeholder={common("email")} required />
      <Input name="subject" placeholder={t("subject")} required />
      <Textarea name="message" placeholder={t("message")} required />
      <Button disabled={loading}>{t("send")}</Button>
    </form>
  );
}

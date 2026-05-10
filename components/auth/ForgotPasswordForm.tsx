"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/firebase/auth";
import { authErrorKey } from "@/lib/firebase/errors";

const schema = z.object({ email: z.string().email() });

/** Localized Firebase password reset form. */
export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  async function submit(values: z.infer<typeof schema>) {
    setError("");
    try {
      await resetPassword(values.email);
    } catch (err) {
      setError(t(`errors.${authErrorKey(err)}`));
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-heading text-4xl text-secondary">{t("forgotTitle")}</h1>
      {error ? <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <form className="mt-6 grid gap-3" onSubmit={form.handleSubmit(submit)}>
        <Input placeholder={t("email")} type="email" {...form.register("email")} />
        <Button>{t("resetButton")}</Button>
      </form>
    </section>
  );
}

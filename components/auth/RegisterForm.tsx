"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/ui/google-icon";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase/config";
import { loginWithGoogle, registerWithEmail } from "@/lib/firebase/auth";
import { authErrorKey } from "@/lib/firebase/errors";
import type { MembershipType } from "@/types";

const plans = ["individual", "family", "student", "corporate"] as const;

function makeSchema(t: ReturnType<typeof useTranslations>) {
  return z
    .object({
      displayName: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      confirmPassword: z.string().min(6),
      phone: z.string().optional(),
      terms: z.literal(true, { errorMap: () => ({ message: t("errors.termsRequired") }) }),
      marketingConsent: z.boolean().optional()
    })
    .refine((values) => values.password === values.confirmPassword, { path: ["confirmPassword"], message: t("errors.passwordMatch") });
}

/** Localized registration form that persists selected membership plan. */
export function RegisterForm() {
  const t = useTranslations("auth");
  const membershipT = useTranslations("membership");
  const searchParams = useSearchParams();
  const router = useRouter();
  const selected = searchParams.get("plan");
  const plan = (plans.includes(selected as MembershipType) ? selected : "individual") as MembershipType;
  const [error, setError] = useState("");
  const schema = makeSchema(t);
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { marketingConsent: false } });

  async function writeUser(uid: string, values: z.infer<typeof schema>, provider: "password" | "google") {
    await setDoc(
      doc(db, "users", uid),
      {
        uid,
        email: values.email,
        displayName: values.displayName,
        phone: values.phone || "",
        role: "member",
        membershipPlan: plan,
        membershipStatus: "pending_payment",
        membershipType: plan,
        marketingConsent: Boolean(values.marketingConsent),
        provider,
        joinedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  }

  async function submit(values: z.infer<typeof schema>) {
    setError("");
    try {
      const user = await registerWithEmail(values.email, values.password, values.displayName);
      await writeUser(user.uid, values, "password");
      router.push("/portal/profile?new=1");
    } catch (err) {
      setError(t(`errors.${authErrorKey(err)}`));
    }
  }

  async function google() {
    setError("");
    try {
      const credential = await loginWithGoogle();
      await writeUser(
        credential.user.uid,
        {
          displayName: credential.user.displayName || "",
          email: credential.user.email || "",
          password: "google-password",
          confirmPassword: "google-password",
          phone: "",
          terms: true,
          marketingConsent: false
        },
        "google"
      );
      router.push("/portal/profile?new=1");
    } catch (err) {
      setError(t(`errors.${authErrorKey(err)}`));
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-heading text-4xl text-secondary">{t("registerTitle")}</h1>
      <p className="mt-3 rounded-lg bg-muted p-3 text-sm text-secondary">
        {t("selectedPlan")}: <strong>{membershipT(`plans.${plan}.name`)}</strong>
      </p>
      {error ? <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <form className="mt-6 grid gap-3" onSubmit={form.handleSubmit(submit)}>
        <input type="hidden" value={plan} name="membershipPlan" />
        <Input placeholder={t("displayName")} {...form.register("displayName")} />
        <Input placeholder={t("email")} type="email" {...form.register("email")} />
        <Input placeholder={t("phone")} {...form.register("phone")} />
        <Input placeholder={t("password")} type="password" {...form.register("password")} />
        <Input placeholder={t("confirmPassword")} type="password" {...form.register("confirmPassword")} />
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input type="checkbox" className="mt-1" {...form.register("terms")} />
          <span><Link href="/privacy" className="text-primary">{t("terms")}</Link></span>
        </label>
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input type="checkbox" className="mt-1" {...form.register("marketingConsent")} />
          <span>{t("marketing")}</span>
        </label>
        {form.formState.errors.confirmPassword ? <p className="text-sm text-red-600">{form.formState.errors.confirmPassword.message}</p> : null}
        {form.formState.errors.terms ? <p className="text-sm text-red-600">{form.formState.errors.terms.message}</p> : null}
        <Button>{t("registerButton")}</Button>
      </form>
      <Button className="mt-3 w-full gap-2" variant="outline" onClick={google}>
        <GoogleIcon />
        {t("googleRegister")}
      </Button>
      <p className="mt-4 text-sm text-muted-foreground">
        {t("haveAccount")} <Link href="/login" className="text-primary">{t("loginLink")}</Link>
      </p>
    </section>
  );
}

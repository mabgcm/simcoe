"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/ui/google-icon";
import { Input } from "@/components/ui/input";
import { loginWithEmail, loginWithGoogle } from "@/lib/firebase/auth";
import { authErrorKey } from "@/lib/firebase/errors";
import { localizePath } from "@/i18n/config";
import { db } from "@/lib/firebase/config";

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

/** Localized Firebase login form. */
export function LoginForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  async function createSession(user: User) {
    const idToken = await user.getIdToken();
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken })
    });
  }

  async function getRoleAndEnsureProfile(user: User) {
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) return snapshot.data().role === "admin" || snapshot.data().role === "super_admin" ? "admin" : "member";

    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        role: "member",
        membershipStatus: "pending_payment",
        membershipPlan: "individual",
        membershipType: "individual",
        provider: user.providerData[0]?.providerId || "firebase",
        joinedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
    return "member";
  }

  async function goAfterLogin(user: User) {
    await createSession(user);
    const role = await getRoleAndEnsureProfile(user);
    const target = role === "admin" ? "/admin" : "/portal/profile";
    router.replace(localizePath(target, locale === "en" ? "en" : "tr"));
    router.refresh();
  }

  async function submit(values: z.infer<typeof schema>) {
    setError("");
    try {
      const credential = await loginWithEmail(values.email, values.password);
      await goAfterLogin(credential.user);
    } catch (err) {
      setError(t(`errors.${authErrorKey(err)}`));
    }
  }

  async function google() {
    setError("");
    try {
      const credential = await loginWithGoogle();
      await goAfterLogin(credential.user);
    } catch (err) {
      setError(t(`errors.${authErrorKey(err)}`));
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-heading text-4xl text-secondary">{t("loginTitle")}</h1>
      {error ? <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <form className="mt-6 grid gap-3" onSubmit={form.handleSubmit(submit)}>
        <Input placeholder={t("email")} type="email" {...form.register("email")} />
        <Input placeholder={t("password")} type="password" {...form.register("password")} />
        <Button>{t("loginButton")}</Button>
      </form>
      <Button className="mt-3 w-full gap-2" variant="outline" onClick={google}>
        <GoogleIcon />
        {t("googleLogin")}
      </Button>
      <div className="mt-4 flex justify-between text-sm">
        <Link href="/register" className="text-primary">{t("registerLink")}</Link>
        <Link href="/forgot-password" className="text-primary">{t("forgotLink")}</Link>
      </div>
    </section>
  );
}

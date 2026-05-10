import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { getMessages, getRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  const messages = getMessages(getRequestLocale());
  return { title: messages.meta.login };
}

/** Email and Google login page. */
export default function LoginPage() {
  return <LoginForm />;
}

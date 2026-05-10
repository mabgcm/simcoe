import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { getMessages, getRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  const messages = getMessages(getRequestLocale());
  return { title: messages.meta.forgotPassword };
}

/** Password reset page using Firebase Auth email flow. */
export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

import type { Metadata } from "next";
import { MembershipPlans } from "@/components/sections/MembershipPlans";
import { getMessages, getRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  const messages = getMessages(getRequestLocale());
  return { title: messages.meta.membership };
}

/** Membership pricing and Stripe checkout entry point. */
export default function MembershipPage() {
  return (
    <MembershipPlans />
  );
}

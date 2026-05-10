import type { Metadata } from "next";
import { PortalProfileForm } from "@/components/member/PortalProfileForm";
import { getMessages, getRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  const messages = getMessages(getRequestLocale());
  return { title: messages.portal.profile };
}

/** Member portal profile route. */
export default function PortalProfilePage() {
  return <PortalProfileForm />;
}

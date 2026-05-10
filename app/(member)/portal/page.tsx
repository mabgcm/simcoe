import type { Metadata } from "next";
import { PortalOverview } from "@/components/member/PortalOverview";
import { getMessages, getRequestLocale } from "@/i18n/server";

export function generateMetadata(): Metadata {
  const messages = getMessages(getRequestLocale());
  return { title: messages.meta.portal };
}

/** Member portal overview route. */
export default function PortalPage() {
  return <PortalOverview />;
}

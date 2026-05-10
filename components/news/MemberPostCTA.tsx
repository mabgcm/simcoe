"use client";

import Link from "next/link";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  type: "news" | "announcement";
};

/**
 * Shows a "add post" button for logged-in members.
 * The membership-status gate is enforced server-side on /portal/posts/new.
 */
export function MemberPostCTA({ type }: Props) {
  const { user, loading } = useAuth();
  if (loading || !user) return null;

  const label = type === "announcement" ? "Duyuru Ekle" : "Haber Ekle";
  return (
    <Button asChild size="sm" variant="outline" className="gap-1.5">
      <Link href={`/portal/posts/new?type=${type}`}>
        <PenLine className="h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ContentActionsProps = {
  collection: "news" | "events";
  id: string;
  slug: string;
  owner: boolean;
  status?: string;
};

/** Row actions for admin content, with owner-only mutation controls. */
export function ContentActions({ collection, id, slug, owner, status }: ContentActionsProps) {
  const router = useRouter();
  const editHref = collection === "events" ? `/admin/events/${id}/edit` : `/admin/news/${id}/edit`;
  const publicHref = collection === "events" ? `/events/${slug}` : `/news/${slug}`;

  async function mutate(method: "POST" | "DELETE", success: string) {
    if (method === "DELETE" && !window.confirm("Bu içeriği silmek istediğinizden emin misiniz?")) return;
    const response = await fetch(`/api/admin/content/${collection}/${id}`, { method });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.error || "İşlem tamamlanamadı.");
    }
    toast.success(success);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href={owner ? editHref : `${editHref}?view=1`}>{owner ? "Düzenle" : "View"}</Link>
      </Button>
      {status === "published" ? (
        <Button asChild size="sm" variant="ghost">
          <Link href={publicHref}>Public</Link>
        </Button>
      ) : null}
      {owner ? (
        <>
          {status !== "published" ? (
            <Button size="sm" onClick={() => mutate("POST", "İçerik yayınlandı.").catch((error) => toast.error(error instanceof Error ? error.message : "İşlem tamamlanamadı."))}>
              Publish
            </Button>
          ) : null}
          <Button size="sm" variant="ghost" onClick={() => mutate("DELETE", "İçerik silindi.").catch((error) => toast.error(error instanceof Error ? error.message : "İşlem tamamlanamadı."))}>
            Delete
          </Button>
        </>
      ) : null}
    </div>
  );
}

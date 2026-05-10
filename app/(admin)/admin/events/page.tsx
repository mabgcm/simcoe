import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/DataTable";
import { ContentActions } from "@/components/admin/ContentActions";
import { listAdminEvents } from "@/lib/content";
import { getCurrentAdmin } from "@/lib/admin-session";

function statusBadge(status?: string, scheduledAt?: Date | null) {
  if (status === "draft") return <Badge className="bg-slate-100 text-slate-700">Taslak</Badge>;
  if (status === "scheduled") return <Badge className="bg-amber-100 text-amber-800">Zamanlandı{scheduledAt ? ` · ${scheduledAt.toLocaleString("tr-CA")}` : ""}</Badge>;
  return <Badge className="bg-green-100 text-green-800">Yayında</Badge>;
}

function dateLabel(status?: string, publishedAt?: Date | null, scheduledAt?: Date | null) {
  if (status === "scheduled") return scheduledAt ? scheduledAt.toLocaleString("tr-CA") : "-";
  if (status === "published") return publishedAt ? publishedAt.toLocaleString("tr-CA") : "-";
  return "-";
}

/** Admin event management page. */
export default async function AdminEventsPage() {
  const [events, admin] = await Promise.all([listAdminEvents(), getCurrentAdmin()]);
  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-4xl text-secondary">Etkinlikler</h1>
        <Button asChild><Link href="/admin/content/new">Yeni İçerik</Link></Button>
      </div>
      <div className="mt-6">
        <DataTable
          columns={["Title", "Location", "Event Date", "Creator", "Publish/Schedule Date", "Status", "Actions"]}
          rows={events.map((item) => ({
            Title: item.title,
            Location: item.location,
            "Event Date": item.startDate.toLocaleDateString("tr-CA"),
            Creator: item.author,
            "Publish/Schedule Date": dateLabel(item.publishStatus, item.publishedAt, item.scheduledAt),
            Status: statusBadge(item.publishStatus, item.scheduledAt),
            Actions: <ContentActions collection="events" id={item.id} slug={item.slug} owner={item.authorId === admin?.uid} status={item.publishStatus} />
          }))}
        />
      </div>
    </section>
  );
}

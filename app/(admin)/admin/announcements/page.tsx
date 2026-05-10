import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/DataTable";
import { ContentActions } from "@/components/admin/ContentActions";
import { listAdminAnnouncements } from "@/lib/content";
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

export default async function AdminAnnouncementsPage() {
  const [announcements, admin] = await Promise.all([listAdminAnnouncements(), getCurrentAdmin()]);
  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-4xl text-secondary">Duyurular</h1>
        <Button asChild><Link href="/admin/content/new">Yeni İçerik</Link></Button>
      </div>
      <div className="mt-6">
        <DataTable
          columns={["Başlık", "Kategori", "Oluşturan", "Yayın / Zamanlama Tarihi", "Durum", "İşlemler"]}
          rows={announcements.map((item) => ({
            Başlık: item.title,
            Kategori: item.category,
            Oluşturan: item.author,
            "Yayın / Zamanlama Tarihi": dateLabel(item.status, item.publishedAt, item.scheduledAt),
            Durum: statusBadge(item.status, item.scheduledAt),
            İşlemler: <ContentActions collection="news" id={item.id} slug={item.slug} owner={item.authorId === admin?.uid} status={item.status} />
          }))}
        />
      </div>
    </section>
  );
}

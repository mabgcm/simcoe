import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/DataTable";
import { listAdminNews } from "@/lib/content";

function statusBadge(status?: string, scheduledAt?: Date | null) {
  if (status === "draft") return <Badge className="bg-slate-100 text-slate-700">Taslak</Badge>;
  if (status === "scheduled") return <Badge className="bg-amber-100 text-amber-800">Zamanlandı{scheduledAt ? ` · ${scheduledAt.toLocaleString("tr-CA")}` : ""}</Badge>;
  return <Badge className="bg-green-100 text-green-800">Yayında</Badge>;
}

/** Admin news management page. */
export default async function AdminNewsPage() {
  const news = await listAdminNews();
  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-4xl text-secondary">Haberler ve Duyurular</h1>
        <Button asChild><Link href="/admin/content/new">Yeni İçerik</Link></Button>
      </div>
      <div className="mt-6">
        <DataTable
          columns={["Title", "Type", "Category", "Status"]}
          rows={news.map((item) => ({
            Title: item.title,
            Type: item.contentType === "announcement" ? "Duyuru" : "Haber",
            Category: item.category,
            Status: statusBadge(item.status, item.scheduledAt)
          }))}
        />
      </div>
    </section>
  );
}

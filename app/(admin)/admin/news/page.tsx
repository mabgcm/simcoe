import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/DataTable";
import { listAdminNews } from "@/lib/content";

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
            Status: "published"
          }))}
        />
      </div>
    </section>
  );
}

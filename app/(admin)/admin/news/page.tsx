import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/DataTable";
import { getNews } from "@/lib/demo-data";
import { getRequestLocale } from "@/i18n/server";

/** Admin news management page. */
export default function AdminNewsPage() {
  const news = getNews(getRequestLocale());
  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-4xl text-secondary">Haberler</h1>
        <Button asChild><Link href="/admin/news/new">Yeni Haber</Link></Button>
      </div>
      <div className="mt-6">
        <DataTable columns={["Title", "Category", "Status"]} rows={news.map((item) => ({ Title: item.title, Category: item.category, Status: "published" }))} />
      </div>
    </section>
  );
}

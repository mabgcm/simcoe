import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/DataTable";
import { listAdminEvents } from "@/lib/content";

function statusBadge(status?: string, scheduledAt?: Date | null) {
  if (status === "draft") return <Badge className="bg-slate-100 text-slate-700">Taslak</Badge>;
  if (status === "scheduled") return <Badge className="bg-amber-100 text-amber-800">Zamanlandı{scheduledAt ? ` · ${scheduledAt.toLocaleString("tr-CA")}` : ""}</Badge>;
  return <Badge className="bg-green-100 text-green-800">Yayında</Badge>;
}

/** Admin event management page. */
export default async function AdminEventsPage() {
  const events = await listAdminEvents();
  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-4xl text-secondary">Etkinlikler</h1>
        <Button asChild><Link href="/admin/content/new">Yeni İçerik</Link></Button>
      </div>
      <div className="mt-6">
        <DataTable columns={["Title", "Location", "Price", "Date", "Status"]} rows={events.map((item) => ({ Title: item.title, Location: item.location, Price: item.price === 0 ? "Free" : `$${item.price}`, Date: item.startDate.toLocaleDateString("tr-CA"), Status: statusBadge(item.publishStatus, item.scheduledAt) }))} />
      </div>
    </section>
  );
}

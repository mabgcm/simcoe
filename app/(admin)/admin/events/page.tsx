import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/DataTable";
import { listAdminEvents } from "@/lib/content";

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
        <DataTable columns={["Title", "Location", "Price", "Date"]} rows={events.map((item) => ({ Title: item.title, Location: item.location, Price: item.price === 0 ? "Free" : `$${item.price}`, Date: item.startDate.toLocaleDateString("tr-CA") }))} />
      </div>
    </section>
  );
}

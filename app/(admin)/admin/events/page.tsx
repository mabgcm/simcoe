import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/DataTable";
import { getEvents } from "@/lib/demo-data";
import { getRequestLocale } from "@/i18n/server";

/** Admin event management page. */
export default function AdminEventsPage() {
  const events = getEvents(getRequestLocale());
  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-4xl text-secondary">Etkinlikler</h1>
        <Button asChild><Link href="/admin/events/new">Yeni Etkinlik</Link></Button>
      </div>
      <div className="mt-6">
        <DataTable columns={["Title", "Location", "Price"]} rows={events.map((item) => ({ Title: item.title, Location: item.location, Price: item.price === 0 ? "Free" : `$${item.price}` }))} />
      </div>
    </section>
  );
}

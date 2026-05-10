import { DataTable } from "@/components/admin/DataTable";
import { sponsors } from "@/lib/demo-data";

/** Admin sponsor management page. */
export default function AdminSponsorsPage() {
  return (
    <section>
      <h1 className="font-heading text-4xl text-secondary">Sponsorlar</h1>
      <div className="mt-6">
        <DataTable columns={["Ad", "Seviye", "Aktif"]} rows={sponsors.map((item) => ({ Ad: item.name, Seviye: item.tier, Aktif: "Evet" }))} />
      </div>
    </section>
  );
}

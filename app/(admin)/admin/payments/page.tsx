import { DataTable } from "@/components/admin/DataTable";

/** Admin payment dashboard page. */
export default function AdminPaymentsPage() {
  return (
    <section>
      <h1 className="font-heading text-4xl text-secondary">Ödemeler</h1>
      <div className="mt-6">
        <DataTable columns={["Tip", "Tutar", "Durum", "Tarih"]} rows={[{ Tip: "Üyelik", Tutar: "$30", Durum: "completed", Tarih: "2026-05-09" }, { Tip: "Bağış", Tutar: "$50", Durum: "completed", Tarih: "2026-05-08" }]} />
      </div>
    </section>
  );
}

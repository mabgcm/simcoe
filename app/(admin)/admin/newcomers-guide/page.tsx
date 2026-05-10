import { DataTable } from "@/components/admin/DataTable";
import { getGuideEntries } from "@/lib/demo-data";
import { getRequestLocale } from "@/i18n/server";

/** Admin newcomers guide management page. */
export default function AdminGuidePage() {
  const guideEntries = getGuideEntries(getRequestLocale());
  return (
    <section>
      <h1 className="font-heading text-4xl text-secondary">Newcomers Guide</h1>
      <div className="mt-6">
        <DataTable columns={["Başlık", "Kategori", "Dil"]} rows={guideEntries.map((item) => ({ Başlık: item.title, Kategori: item.category, Dil: item.language }))} />
      </div>
    </section>
  );
}

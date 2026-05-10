import { Card, CardContent } from "@/components/ui/card";

/** Admin dashboard landing page. */
export default function AdminPage() {
  const stats = ["Aktif Üye", "Yayınlanan Haber", "Yaklaşan Etkinlik", "Aylık Gelir"];
  return (
    <section>
      <h1 className="font-heading text-4xl text-secondary">Admin Genel Bakış</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={stat}><CardContent className="p-5"><p className="text-sm text-muted-foreground">{stat}</p><p className="mt-2 text-3xl font-bold text-primary">{[128, 24, 3, "$2.4k"][index]}</p></CardContent></Card>
        ))}
      </div>
    </section>
  );
}

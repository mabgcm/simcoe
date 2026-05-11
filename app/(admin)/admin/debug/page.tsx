import { getAdminDb } from "@/lib/firebase/admin";

/** Diagnostic page — shows raw Firestore status of the 10 most recent news docs. */
export const dynamic = "force-dynamic";

export default async function AdminDebugPage() {
  let rows: Array<{ id: string; title: string; status: string; source: string; publishedAt: string }> = [];
  let projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || "(not set)";
  let error = "";

  try {
    const snap = await getAdminDb().collection("news").orderBy("publishedAt", "desc").limit(10).get();
    rows = snap.docs.map((doc) => {
      const d = doc.data();
      const pa = d.publishedAt;
      const paStr = pa?.toDate ? pa.toDate().toISOString() : String(pa ?? "null");
      return {
        id: doc.id,
        title: (d.title as string) || "(no title)",
        status: (d.status as string) || "(none)",
        source: (d.source as string) || "admin",
        publishedAt: paStr,
      };
    });
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <section>
      <h1 className="font-heading text-3xl text-secondary">Firestore Tanı</h1>
      <p className="mt-2 text-sm text-muted-foreground">Firebase proje: <strong>{projectId}</strong></p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <strong>Firebase hatası:</strong> {error}
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <tr>
              {["ID", "Başlık", "Durum", "Kaynak", "publishedAt"].map((h) => (
                <th key={h} className="px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.length === 0 && !error && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">Belge bulunamadı.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className={r.status === "published" && r.source === "member" ? "bg-green-50" : ""}>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{r.id}</td>
                <td className="px-4 py-2">{r.title}</td>
                <td className="px-4 py-2">
                  <span className={r.status === "published" ? "text-green-700 font-semibold" : "text-amber-700"}>{r.status}</span>
                </td>
                <td className="px-4 py-2">{r.source}</td>
                <td className="px-4 py-2 font-mono text-xs">{r.publishedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Üye gönderileri yeşil satırla gösterilir (source=member, status=published).</p>
    </section>
  );
}

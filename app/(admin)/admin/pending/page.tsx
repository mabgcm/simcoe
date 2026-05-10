import { listPendingMemberPosts } from "@/lib/content";
import { PendingPostsList } from "@/components/admin/PendingPostsList";

export default async function AdminPendingPage() {
  const posts = await listPendingMemberPosts();
  return (
    <section>
      <h1 className="font-heading text-4xl text-secondary">Üye İçerikleri — Onay Bekliyor</h1>
      <p className="mt-2 text-sm text-muted-foreground">Yayınlamak için Onayla, reddetmek için Reddet&apos;e tıklayın.</p>
      <div className="mt-6">
        <PendingPostsList posts={posts} />
      </div>
    </section>
  );
}

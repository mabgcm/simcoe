import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

function statusBadge(status: string) {
  if (status === "published") return <Badge className="bg-green-100 text-green-800">Yayında</Badge>;
  if (status === "rejected") return <Badge className="bg-red-100 text-red-800">Reddedildi</Badge>;
  return <Badge className="bg-amber-100 text-amber-800">Onay Bekliyor</Badge>;
}

async function getMemberPosts(uid: string) {
  try {
    // Single equality filter on authorId avoids composite index requirement.
    const snap = await getAdminDb()
      .collection("news")
      .where("authorId", "==", uid)
      .limit(50)
      .get();
    return snap.docs
      .filter((doc) => doc.data().source === "member")
      .map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          title: (d.title as string) || "",
          contentType: (d.contentType as string) || "news",
          status: (d.status as string) || "pending_admin",
          createdAt: (d.createdAt as { toDate?: () => Date } | null)?.toDate?.()?.toLocaleDateString("tr-TR") ?? "-"
        };
      })
      .sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
  } catch (error) {
    console.error("Unable to load member posts.", error);
    return [];
  }
}

export default async function MemberPostsPage() {
  const session = cookies().get("session")?.value;
  if (!session) redirect("/login");

  let uid: string;
  try {
    const decoded = await getAdminAuth().verifySessionCookie(session);
    uid = decoded.uid;
    const snap = await getAdminDb().collection("users").doc(uid).get();
    if (snap.data()?.membershipStatus !== "active") redirect("/portal/profile?new=1");
  } catch {
    redirect("/login");
  }

  const posts = await getMemberPosts(uid!);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-5xl text-secondary">Gönderilerim</h1>
        <Button asChild><Link href="/portal/posts/new">Yeni Gönderi</Link></Button>
      </div>
      <div className="mt-8 grid gap-3">
        {posts.length === 0 && (
          <p className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            Henüz gönderi oluşturmadınız.
          </p>
        )}
        {posts.map((post) => (
          <Link key={post.id} href={`/portal/posts/${post.id}`} className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm hover:border-primary/40">
            <div>
              <p className="font-semibold text-secondary">{post.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{post.contentType === "announcement" ? "Duyuru" : "Haber"} · {post.createdAt}</p>
            </div>
            {statusBadge(post.status)}
          </Link>
        ))}
      </div>
    </section>
  );
}

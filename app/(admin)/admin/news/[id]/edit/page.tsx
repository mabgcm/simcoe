import { notFound } from "next/navigation";
import { ContentForm } from "@/components/admin/content-form";
import { getCurrentAdmin } from "@/lib/admin-session";
import { getAdminNewsById } from "@/lib/content";

/** Admin edit news page. */
export default async function EditNewsPage({ params, searchParams }: { params: { id: string }; searchParams: { view?: string } }) {
  const [article, admin] = await Promise.all([getAdminNewsById(params.id), getCurrentAdmin()]);
  if (!article) notFound();
  const owner = article.authorId === admin?.uid;
  // Admins can also edit pending member posts before approving them.
  const canEdit = owner || (article.source === "member" && article.status === "pending_admin");
  // ContentForm only knows draft/published/scheduled; normalize pending_admin and rejected to draft.
  const formStatus = (article.status === "pending_admin" || article.status === "rejected") ? "draft" : (article.status ?? "draft");
  const editTitle = canEdit && searchParams.view !== "1"
    ? (article.source === "member" && article.status === "pending_admin" ? "Üye Gönderisini Düzenle" : "İçeriği Düzenle")
    : "İçerik Görüntüle";
  return (
    <ContentForm
      title={editTitle}
      documentId={params.id}
      collectionName="news"
      readOnly={!canEdit || searchParams.view === "1"}
      defaultType={article.contentType || "news"}
      initialValues={{
        contentType: article.contentType || "news",
        status: formStatus,
        scheduledAt: article.scheduledAt,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        category: article.category,
        content: article.content,
        coverImage: article.coverImage
      }}
    />
  );
}

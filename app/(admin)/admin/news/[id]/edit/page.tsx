import { notFound } from "next/navigation";
import { ContentForm } from "@/components/admin/content-form";
import { getCurrentAdmin } from "@/lib/admin-session";
import { getAdminNewsById } from "@/lib/content";

/** Admin edit news page. */
export default async function EditNewsPage({ params, searchParams }: { params: { id: string }; searchParams: { view?: string } }) {
  const [article, admin] = await Promise.all([getAdminNewsById(params.id), getCurrentAdmin()]);
  if (!article) notFound();
  const owner = article.authorId === admin?.uid;
  return (
    <ContentForm
      title={owner && searchParams.view !== "1" ? "İçeriği Düzenle" : "İçerik Görüntüle"}
      documentId={params.id}
      collectionName="news"
      readOnly={!owner || searchParams.view === "1"}
      defaultType={article.contentType || "news"}
      initialValues={{
        contentType: article.contentType || "news",
        status: article.status || "draft",
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

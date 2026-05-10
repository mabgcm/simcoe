import { ContentForm } from "@/components/admin/content-form";

/** Admin edit news page. */
export default function EditNewsPage({ params }: { params: { id: string } }) {
  return <ContentForm title={`Haberi Düzenle: ${params.id}`} />;
}

import { notFound } from "next/navigation";
import { ContentForm } from "@/components/admin/content-form";
import { getCurrentAdmin } from "@/lib/admin-session";
import { getAdminEventById } from "@/lib/content";

/** Admin edit event page. */
export default async function EditEventPage({ params, searchParams }: { params: { id: string }; searchParams: { view?: string } }) {
  const [event, admin] = await Promise.all([getAdminEventById(params.id), getCurrentAdmin()]);
  if (!event) notFound();
  const owner = event.authorId === admin?.uid;
  return (
    <ContentForm
      title={owner && searchParams.view !== "1" ? "Etkinliği Düzenle" : "Etkinlik Görüntüle"}
      documentId={params.id}
      collectionName="events"
      readOnly={!owner || searchParams.view === "1"}
      defaultType="event"
      initialValues={{
        contentType: "event",
        status: event.publishStatus || "draft",
        scheduledAt: event.scheduledAt,
        title: event.title,
        slug: event.slug,
        category: event.category,
        content: event.description,
        coverImage: event.coverImage,
        location: event.location,
        address: event.address,
        startDate: event.startDate,
        endDate: event.endDate,
        price: event.price,
        capacity: event.capacity,
        conditions: event.conditions
      }}
    />
  );
}

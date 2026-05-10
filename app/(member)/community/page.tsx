import { PostCard } from "@/components/member/PostCard";
import { PostComposer } from "@/components/member/PostComposer";

/** Active-member community board. */
export default function CommunityPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-5xl text-secondary">Topluluk Panosu</h1>
      <div className="mt-8 grid gap-5">
        <PostComposer />
        <PostCard author="STA Yönetimi" content="Bu alan aktif üyelerin duyuru, soru ve kaynak paylaşımı için hazırlanmıştır." likes={12} />
      </div>
    </section>
  );
}

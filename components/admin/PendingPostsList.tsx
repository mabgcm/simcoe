"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PublicNewsArticle } from "@/lib/content";

type Post = PublicNewsArticle & { authorPhotoURL: string };

function PreviewPanel({ post }: { post: Post }) {
  return (
    <div className="mt-4 rounded-lg border bg-muted/30 p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">{post.contentType === "announcement" ? "Duyuru" : "Haber"} · {post.category}</p>
      <h2 className="mt-2 font-heading text-2xl text-secondary">{post.title}</h2>
      {post.excerpt && <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>}
      {post.coverImage && (
        <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-lg">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" unoptimized />
        </div>
      )}
      <div
        className="prose-content mt-4 rounded-lg bg-white p-4 text-sm"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />
    </div>
  );
}

export function PendingPostsList({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function toggle(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  function handleAction(id: string, action: "approve" | "reject") {
    startTransition(async () => {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: action === "approve" ? "POST" : "DELETE"
      });
      if (res.ok) {
        toast.success(action === "approve" ? "İçerik yayınlandı." : "İçerik reddedildi.");
        router.refresh();
      } else {
        toast.error("İşlem tamamlanamadı.");
      }
    });
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/20 p-10 text-center text-muted-foreground">
        Onay bekleyen içerik yok.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {posts.map((post) => (
        <div key={post.id} className="rounded-lg border bg-white shadow-sm">
          <div className="flex flex-wrap items-center gap-4 p-4">
            {/* Author */}
            <div className="flex items-center gap-2 min-w-0">
              {post.authorPhotoURL ? (
                <Image src={post.authorPhotoURL} alt={post.author} width={36} height={36} className="h-9 w-9 shrink-0 rounded-lg object-cover" unoptimized />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                  {post.author.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-secondary">{post.author}</p>
                <p className="text-xs text-muted-foreground">{post.publishedAt.toLocaleDateString("tr-TR")}</p>
              </div>
            </div>

            {/* Title + type */}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-secondary">{post.title}</p>
              <Badge className="mt-1 bg-muted text-secondary text-xs">{post.contentType === "announcement" ? "Duyuru" : "Haber"}</Badge>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => toggle(post.id)}>
                {expanded === post.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                Önizleme
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/admin/news/${post.id}/edit`}>
                  <Pencil className="h-4 w-4" />
                  Düzenle
                </Link>
              </Button>
              <Button size="sm" onClick={() => handleAction(post.id, "approve")}>Onayla</Button>
              <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleAction(post.id, "reject")}>Reddet</Button>
            </div>
          </div>

          {expanded === post.id && <PreviewPanel post={post} />}
        </div>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CornerDownRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Comment = {
  id: string;
  authorName: string;
  authorPhotoURL: string;
  content: string;
  parentId: string | null;
  status: string;
  createdAt: string;
};

type Post = {
  id: string;
  title: string;
  status: string;
  contentType: string;
};

function statusBadge(status: string) {
  if (status === "published") return <Badge className="bg-green-100 text-green-800">Yayında</Badge>;
  if (status === "rejected") return <Badge className="bg-red-100 text-red-800">Reddedildi</Badge>;
  return <Badge className="bg-amber-100 text-amber-800">Onay Bekliyor</Badge>;
}

function Avatar({ name, photoURL, size = 32 }: { name: string; photoURL: string; size?: number }) {
  return photoURL ? (
    <Image src={photoURL} alt={name} width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} unoptimized />
  ) : (
    <div className="flex shrink-0 items-center justify-center rounded-full bg-muted font-bold text-secondary text-sm" style={{ width: size, height: size }}>
      {name.charAt(0)}
    </div>
  );
}

export default function MemberPostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    async function load() {
      const [postRes, commentRes] = await Promise.all([
        fetch(`/api/member/posts/${id}`),
        fetch(`/api/member/posts/${id}/comments/list`)
      ]);
      if (postRes.ok) setPost(await postRes.json() as Post);
      if (commentRes.ok) {
        const data = await commentRes.json() as { comments: Comment[] };
        setComments(data.comments);
      }
      setLoading(false);
    }
    void load();
  }, [id]);

  function handleComment(commentId: string, action: "approve" | "reject") {
    startTransition(async () => {
      const res = await fetch(`/api/member/posts/${id}/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, status: action === "approve" ? "approved" : "rejected" } : c));
        toast.success(action === "approve" ? "Onaylandı." : "Reddedildi.");
      } else {
        toast.error("İşlem tamamlanamadı.");
      }
    });
  }

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-16 text-muted-foreground">Yükleniyor...</div>;
  if (!post) return <div className="mx-auto max-w-3xl px-4 py-16 text-muted-foreground">Gönderi bulunamadı.</div>;

  const pending = comments.filter((c) => c.status === "pending");
  const approved = comments.filter((c) => c.status === "approved");

  // Map id → comment for showing parent context
  const byId = Object.fromEntries(comments.map((c) => [c.id, c]));

  const topApproved = approved.filter((c) => !c.parentId);
  const repliesFor = (parentId: string) => approved.filter((c) => c.parentId === parentId);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{post.contentType === "announcement" ? "Duyuru" : "Haber"}</p>
          <h1 className="mt-1 font-heading text-4xl text-secondary">{post.title}</h1>
        </div>
        {statusBadge(post.status)}
      </div>

      {post.status === "pending_admin" && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Gönderiniz yönetici incelemesinde. Onaylandıktan sonra yayınlanacaktır.
        </p>
      )}
      {post.status === "rejected" && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          Gönderiniz yönetici tarafından reddedildi.
        </p>
      )}

      {/* Pending approval */}
      <div className="mt-10">
        <h2 className="font-heading text-2xl text-secondary">Onay Bekleyen ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Onay bekleyen yorum yok.</p>
        ) : (
          <div className="mt-4 grid gap-3">
            {pending.map((comment) => {
              const parent = comment.parentId ? byId[comment.parentId] : null;
              return (
                <div key={comment.id} className="rounded-lg border bg-white p-4 shadow-sm">
                  {parent && (
                    <div className="mb-3 flex items-center gap-1.5 rounded bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">
                      <CornerDownRight className="h-3 w-3 shrink-0" />
                      <span className="font-semibold">{parent.authorName}:</span>
                      <span className="truncate">{parent.content}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Avatar name={comment.authorName} photoURL={comment.authorPhotoURL} />
                    <span className="text-sm font-semibold text-secondary">{comment.authorName}</span>
                    {parent && <span className="text-xs text-muted-foreground">(yanıt)</span>}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{comment.content}</p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={() => handleComment(comment.id, "approve")}>Onayla</Button>
                    <Button size="sm" variant="outline" onClick={() => handleComment(comment.id, "reject")}>Reddet</Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Approved — threaded */}
      <div className="mt-8">
        <h2 className="font-heading text-2xl text-secondary">Yayınlanmış Yorumlar ({topApproved.length})</h2>
        {topApproved.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Yayınlanmış yorum yok.</p>
        ) : (
          <div className="mt-4 grid gap-3">
            {topApproved.map((comment) => {
              const commentReplies = repliesFor(comment.id);
              return (
                <div key={comment.id}>
                  <div className="flex gap-3 rounded-lg border bg-white p-4">
                    <Avatar name={comment.authorName} photoURL={comment.authorPhotoURL} />
                    <div>
                      <p className="text-sm font-semibold text-secondary">{comment.authorName}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{comment.content}</p>
                    </div>
                  </div>
                  {commentReplies.length > 0 && (
                    <div className="ml-8 mt-2 grid gap-2 border-l-2 border-primary/20 pl-4">
                      {commentReplies.map((reply) => (
                        <div key={reply.id} className="flex gap-3 rounded-lg border bg-muted/30 p-3">
                          <Avatar name={reply.authorName} photoURL={reply.authorPhotoURL} size={28} />
                          <div>
                            <p className="text-sm font-semibold text-secondary">{reply.authorName}</p>
                            <p className="mt-0.5 text-sm text-muted-foreground">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Button variant="outline" className="mt-8" asChild><Link href="/portal/posts">← Gönderilerim</Link></Button>
    </section>
  );
}

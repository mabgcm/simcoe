"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

type Comment = {
  id: string;
  authorName: string;
  authorPhotoURL: string;
  content: string;
  createdAt: string | null;
};

type Props = {
  postId: string;
  isMemberPost: boolean;
};

/** Public comments section for member-authored posts. */
export function CommentsSection({ postId, isMemberPost }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!isMemberPost) { setLoading(false); return; }
    fetch(`/api/public/posts/${postId}/comments`)
      .then((r) => r.json())
      .then((data: { comments?: Comment[] }) => { setComments(data.comments ?? []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId, isMemberPost]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    startTransition(async () => {
      const res = await fetch(`/api/member/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text.trim() })
      });
      if (res.ok) {
        toast.success("Yorumunuz gönderildi. Onaylandıktan sonra yayınlanacak.");
        setText("");
      } else {
        const payload = await res.json().catch(() => null) as { error?: string } | null;
        toast.error(payload?.error || "Yorum gönderilemedi.");
      }
    });
  }

  if (!isMemberPost) return null;

  return (
    <div className="mt-12 border-t pt-10">
      <h2 className="font-heading text-2xl text-secondary">Yorumlar ({comments.length})</h2>

      {loading ? (
        <p className="mt-4 text-sm text-muted-foreground">Yükleniyor...</p>
      ) : comments.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Henüz yorum yok. İlk yorumu siz yapın.</p>
      ) : (
        <div className="mt-6 grid gap-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 rounded-lg border bg-white p-4">
              {comment.authorPhotoURL ? (
                <Image src={comment.authorPhotoURL} alt={comment.authorName} width={36} height={36} className="h-9 w-9 shrink-0 rounded-lg object-cover" unoptimized />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary text-sm">
                  {comment.authorName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-secondary">{comment.authorName}</p>
                <p className="mt-1 text-sm text-muted-foreground">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {user ? (
        <form className="mt-8 grid gap-3" onSubmit={submit}>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Yorumunuzu yazın..."
            rows={3}
          />
          <Button className="w-fit" disabled={!text.trim()}>Yorum Gönder</Button>
        </form>
      ) : (
        <p className="mt-6 rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
          Yorum yapabilmek için <a href="/login" className="font-semibold text-primary">giriş yapın</a>.
        </p>
      )}
    </div>
  );
}

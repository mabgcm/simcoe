"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { CornerDownRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

type Comment = {
  id: string;
  authorName: string;
  authorPhotoURL: string;
  content: string;
  parentId: string | null;
  createdAt: string | null;
};

type Props = {
  postId: string;
  isMemberPost: boolean;
};

function Avatar({ name, photoURL, size = 36 }: { name: string; photoURL: string; size?: number }) {
  return photoURL ? (
    <Image src={photoURL} alt={name} width={size} height={size} className="shrink-0 rounded-lg object-cover" style={{ width: size, height: size }} unoptimized />
  ) : (
    <div className="flex shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary" style={{ width: size, height: size }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function ReplyForm({ postId, parentId, onDone }: { postId: string; parentId: string; onDone: () => void }) {
  const [text, setText] = useState("");
  const [, startTransition] = useTransition();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    startTransition(async () => {
      const res = await fetch(`/api/member/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text.trim(), parentId })
      });
      if (res.ok) {
        const data = await res.json() as { autoApproved?: boolean };
        toast.success(data.autoApproved ? "Yanıtınız yayınlandı." : "Yanıtınız gönderildi. Onaylandıktan sonra görünecek.");
        setText("");
        onDone();
      } else {
        const payload = await res.json().catch(() => null) as { error?: string } | null;
        toast.error(payload?.error || "Yanıt gönderilemedi.");
      }
    });
  }

  return (
    <form className="mt-3 grid gap-2" onSubmit={submit}>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Yanıtınızı yazın..." rows={2} className="text-sm" />
      <div className="flex gap-2">
        <Button size="sm" disabled={!text.trim()}>Yanıtla</Button>
        <Button size="sm" variant="outline" type="button" onClick={onDone}>İptal</Button>
      </div>
    </form>
  );
}

/** Public threaded comments section for member-authored posts. */
export function CommentsSection({ postId, isMemberPost }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function loadComments() {
    fetch(`/api/public/posts/${postId}/comments`)
      .then((r) => r.json())
      .then((data: { comments?: Comment[] }) => setComments(data.comments ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!isMemberPost) { setLoading(false); return; }
    loadComments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, isMemberPost]);

  function submitTop(event: React.FormEvent) {
    event.preventDefault();
    if (!newText.trim()) return;
    startTransition(async () => {
      const res = await fetch(`/api/member/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newText.trim() })
      });
      if (res.ok) {
        const data = await res.json() as { autoApproved?: boolean };
        toast.success(data.autoApproved ? "Yorumunuz yayınlandı." : "Yorumunuz gönderildi. Onaylandıktan sonra yayınlanacak.");
        setNewText("");
        if (data.autoApproved) loadComments();
      } else {
        const payload = await res.json().catch(() => null) as { error?: string } | null;
        toast.error(payload?.error || "Yorum gönderilemedi.");
      }
    });
  }

  if (!isMemberPost) return null;

  const topLevel = comments.filter((c) => !c.parentId);
  const replies = (parentId: string) => comments.filter((c) => c.parentId === parentId);

  return (
    <div className="mt-12 border-t pt-10">
      <h2 className="font-heading text-2xl text-secondary">Yorumlar ({topLevel.length})</h2>

      {loading ? (
        <p className="mt-4 text-sm text-muted-foreground">Yükleniyor...</p>
      ) : topLevel.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Henüz yorum yok. İlk yorumu siz yapın.</p>
      ) : (
        <div className="mt-6 grid gap-4">
          {topLevel.map((comment) => {
            const commentReplies = replies(comment.id);
            return (
              <div key={comment.id}>
                {/* Top-level comment */}
                <div className="flex gap-3 rounded-lg border bg-white p-4">
                  <Avatar name={comment.authorName} photoURL={comment.authorPhotoURL} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-secondary">{comment.authorName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{comment.content}</p>
                    {user && (
                      <button
                        className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      >
                        <CornerDownRight className="h-3 w-3" />
                        Yanıtla
                      </button>
                    )}
                    {replyingTo === comment.id && (
                      <ReplyForm postId={postId} parentId={comment.id} onDone={() => setReplyingTo(null)} />
                    )}
                  </div>
                </div>

                {/* Replies */}
                {commentReplies.length > 0 && (
                  <div className="ml-8 mt-2 grid gap-2 border-l-2 border-primary/20 pl-4">
                    {commentReplies.map((reply) => (
                      <div key={reply.id} className="flex gap-3 rounded-lg border bg-muted/30 p-3">
                        <Avatar name={reply.authorName} photoURL={reply.authorPhotoURL} size={28} />
                        <div className="min-w-0">
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

      {user ? (
        <form className="mt-8 grid gap-3" onSubmit={submitTop}>
          <Textarea value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="Yorumunuzu yazın..." rows={3} />
          <Button className="w-fit" disabled={!newText.trim()}>Yorum Gönder</Button>
        </form>
      ) : (
        <p className="mt-6 rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
          Yorum yapabilmek için <a href="/login" className="font-semibold text-primary">giriş yapın</a>.
        </p>
      )}
    </div>
  );
}

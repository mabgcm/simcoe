import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/** Community post card with author and likes. */
export function PostCard({ author, content, likes }: { author: string; content: string; likes: number }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="font-semibold text-secondary">{author}</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{content}</p>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Heart className="h-4 w-4 text-primary" />
          {likes}
        </div>
      </CardContent>
    </Card>
  );
}

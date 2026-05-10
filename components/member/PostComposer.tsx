"use client";

import { useState } from "react";
import { ImagePlus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/** Composer for authenticated member community posts. */
export function PostComposer() {
  const [content, setContent] = useState("");
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <Textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Toplulukla paylaş..." />
      <div className="mt-3 flex justify-between">
        <Button variant="outline" size="sm" aria-label="Görsel ekle">
          <ImagePlus className="h-4 w-4" />
          Görsel
        </Button>
        <Button size="sm" disabled={!content.trim()}>
          <Send className="h-4 w-4" />
          Paylaş
        </Button>
      </div>
    </div>
  );
}

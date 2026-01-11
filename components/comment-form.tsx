"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CommentFormProps {
  postId: string;
}

export function CommentForm({ postId }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });

    setLoading(false);

    if (response.ok) {
      setContent("");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        className="input min-h-[120px]"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Yorum yaz..."
        required
      />
      <button className="btn" type="submit" disabled={loading}>
        {loading ? "Gonderiliyor..." : "Yorum Ekle"}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PostActionsProps {
  postId: string;
  initialLikeCount: number;
  initialLiked: boolean;
  canDelete: boolean;
  canLike: boolean;
}

export function PostActions({
  postId,
  initialLikeCount,
  initialLiked,
  canDelete,
  canLike
}: PostActionsProps) {
  const router = useRouter();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    setLoading(true);
    const response = await fetch(`/api/posts/${postId}/likes`, { method: "POST" });
    if (response.ok) {
      const data = await response.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Postu silmek istiyor musunuz?")) return;
    const response = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (response.ok) {
      router.push("/posts");
      router.refresh();
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button className="btn-secondary" onClick={handleLike} disabled={loading || !canLike}>
        {liked ? "Unlike" : "Like"} ({likeCount})
      </button>
      {canDelete ? (
        <button className="btn-secondary" onClick={handleDelete}>
          Delete
        </button>
      ) : null}
      {!canLike ? <span className="text-xs text-ink/60">Login to like</span> : null}
    </div>
  );
}

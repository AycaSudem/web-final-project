"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PostDeleteButtonProps {
  postId: string;
}

export function PostDeleteButton({ postId }: PostDeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Postu silmek istiyor musunuz?")) return;
    setLoading(true);
    const response = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    setLoading(false);
    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <button className="btn-secondary" onClick={handleDelete} disabled={loading}>
      {loading ? "Siliniyor..." : "Delete"}
    </button>
  );
}

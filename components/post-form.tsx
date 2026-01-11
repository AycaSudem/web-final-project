"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PostForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        content: formData.get("content")
      })
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Post olusturulamadi.");
      return;
    }

    const data = await response.json();
    router.push(`/posts/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 card">
      <div className="space-y-2">
        <label className="label" htmlFor="title">
          Title
        </label>
        <input className="input" id="title" name="title" type="text" required />
      </div>
      <div className="space-y-2">
        <label className="label" htmlFor="content">
          Content
        </label>
        <textarea className="input min-h-[180px]" id="content" name="content" required />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button className="btn" type="submit" disabled={loading}>
        {loading ? "Paylasiliyor..." : "Post Paylas"}
      </button>
      <p className="text-xs text-ink/60">
        TODO: Detayli input validation, markdown editor ve autosave.
      </p>
    </form>
  );
}

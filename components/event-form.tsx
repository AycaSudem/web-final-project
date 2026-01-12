"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EventForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      startDateTime: formData.get("startDateTime"),
      endDateTime: formData.get("endDateTime"),
      location: formData.get("location"),
      university: formData.get("university"),
      clubName: formData.get("clubName"),
      category: formData.get("category")
    };

    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Etkinlik olusturulamadi.");
      return;
    }

    const data = await response.json();
    router.push(`/events/${data.id}`);
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
        <label className="label" htmlFor="description">
          Description
        </label>
        <textarea className="input min-h-[140px]" id="description" name="description" required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="label" htmlFor="startDateTime">
            Start Date & Time
          </label>
          <input className="input" id="startDateTime" name="startDateTime" type="datetime-local" required />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="endDateTime">
            End Date & Time (optional)
          </label>
          <input className="input" id="endDateTime" name="endDateTime" type="datetime-local" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="label" htmlFor="location">
          Location
        </label>
        <input className="input" id="location" name="location" type="text" required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="label" htmlFor="university">
            University
          </label>
          <input className="input" id="university" name="university" type="text" required />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="clubName">
            Club Name
          </label>
          <input className="input" id="clubName" name="clubName" type="text" required />
        </div>
      </div>
      <div className="space-y-2">
        <label className="label" htmlFor="category">
          Category
        </label>
        <input className="input" id="category" name="category" type="text" required />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button className="btn" type="submit" disabled={loading}>
        {loading ? "Kaydediliyor..." : "Etkinlik Ekle"}
      </button>
      <p className="text-xs text-ink/60">
        TODO: Kategori secici, timezone picker, kapasite ve RSVP akisi.
      </p>
    </form>
  );
}

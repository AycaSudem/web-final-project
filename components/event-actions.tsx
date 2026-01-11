"use client";

import { useRouter } from "next/navigation";

interface EventActionsProps {
  eventId: string;
  canDelete: boolean;
}

export function EventActions({ eventId, canDelete }: EventActionsProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Etkinligi silmek istiyor musunuz?")) return;
    const response = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
    if (response.ok) {
      router.push("/events");
      router.refresh();
    }
  }

  if (!canDelete) return null;

  return (
    <button className="btn-secondary" onClick={handleDelete}>
      Delete
    </button>
  );
}

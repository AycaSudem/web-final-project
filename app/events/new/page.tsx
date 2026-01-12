import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EventForm } from "@/components/event-form";

export default async function NewEventPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">New Event</h1>
        <p className="text-sm text-ink/60">
          Etkinlik eklemek icin <Link href="/login" className="text-accent">login</Link> olmalisin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">New Event</h1>
      <EventForm />
    </div>
  );
}

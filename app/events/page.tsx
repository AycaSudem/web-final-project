import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EventCard } from "@/components/event-card";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startDateTime: "asc" },
    include: { creator: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Events</h1>
        <Link href="/events/new" className="btn">
          New Event
        </Link>
      </div>
      <div className="grid gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

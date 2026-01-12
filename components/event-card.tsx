import Link from "next/link";
import type { Event, User } from "@prisma/client";

interface EventCardProps {
  event: Event & { creator: User };
}

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          <Link href={`/events/${event.id}`} className="hover:text-accent">
            {event.title}
          </Link>
        </h3>
        <span className="text-xs text-ink/60">
          {new Date(event.startDateTime).toLocaleString()}
        </span>
      </div>
      <p className="mt-3 text-sm text-ink/80">{event.description}</p>
      <div className="mt-4 flex items-center gap-4 text-xs text-ink/60">
        <span>{event.university}</span>
        <span>{event.location}</span>
        <span>By {event.creator.name}</span>
      </div>
    </article>
  );
}

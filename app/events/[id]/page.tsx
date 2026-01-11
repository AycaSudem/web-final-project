import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EventActions } from "@/components/event-actions";

interface EventDetailPageProps {
  params: { id: string };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const session = await getServerSession(authOptions);
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: { creator: true }
  });

  if (!event) {
    return <p>Event not found.</p>;
  }

  const isOwner = session?.user?.id === event.creatorUserId;

  return (
    <div className="space-y-6">
      <Link href="/events" className="text-sm text-ink/60">
        ← Back to events
      </Link>

      <article className="card space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">{event.title}</h1>
            <p className="text-sm text-ink/60">
              {event.university} • {event.location}
            </p>
            <p className="text-sm text-ink/60">
              {new Date(event.startDateTime).toLocaleString()} {event.endDateTime ? `- ${new Date(event.endDateTime).toLocaleString()}` : ""}
            </p>
          </div>
          <EventActions eventId={event.id} canDelete={isOwner} />
        </div>
        <p className="text-sm text-ink/80 whitespace-pre-line">{event.description}</p>
        <div className="text-sm text-ink/70">
          <p>Club: {event.clubName}</p>
          <p>Category: {event.category}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link className="btn-secondary" href={`/events/${event.id}/calendar`}>
            Add to Calendar (.ics)
          </Link>
          <span className="text-xs text-ink/60">Timezone: Europe/Istanbul</span>
        </div>
      </article>
    </div>
  );
}

import { prisma } from "@/lib/prisma";

function formatDateTimeUtc(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function formatDateTimeInTz(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  const parts = formatter.formatToParts(date);
  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${lookup.year}${lookup.month}${lookup.day}T${lookup.hour}${lookup.minute}${lookup.second}`;
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({ where: { id: params.id } });

  if (!event) {
    return new Response("Not found", { status: 404 });
  }

  const timeZone = "Europe/Istanbul";
  const dtStamp = formatDateTimeUtc(new Date());
  const dtStart = formatDateTimeInTz(event.startDateTime, timeZone);
  const dtEnd = event.endDateTime ? formatDateTimeInTz(event.endDateTime, timeZone) : undefined;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NextCampus//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.id}@nextcampus`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;TZID=${timeZone}:${dtStart}`,
    dtEnd ? `DTEND;TZID=${timeZone}:${dtEnd}` : null,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].filter(Boolean);

  const body = lines.join("\r\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.title}.ics"`
    }
  });
}

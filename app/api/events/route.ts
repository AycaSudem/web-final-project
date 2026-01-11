import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  startDateTime: z.string().min(1),
  endDateTime: z.string().optional().nullable(),
  location: z.string().min(2),
  university: z.string().min(2),
  clubName: z.string().min(2),
  category: z.string().min(2)
  // TODO: Add category enum and advanced validation.
});

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { startDateTime: "asc" },
    include: { creator: true }
  });

  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = eventSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Gecersiz alanlar." }, { status: 400 });
  }

  const startDateTime = new Date(result.data.startDateTime);
  const endDateTime = result.data.endDateTime ? new Date(result.data.endDateTime) : null;

  const event = await prisma.event.create({
    data: {
      creatorUserId: session.user.id,
      title: result.data.title,
      description: result.data.description,
      startDateTime,
      endDateTime,
      location: result.data.location,
      university: result.data.university,
      clubName: result.data.clubName,
      category: result.data.category
    }
  });

  return NextResponse.json({ id: event.id });
}

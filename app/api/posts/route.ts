import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const postSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10)
  // TODO: Add max length validation and profanity filter.
});

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, comments: true, likes: true }
  });

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = postSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Gecersiz alanlar." }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      userId: session.user.id,
      title: result.data.title,
      content: result.data.content
    }
  });

  return NextResponse.json({ id: post.id });
}

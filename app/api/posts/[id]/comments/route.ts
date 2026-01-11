import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const commentSchema = z.object({
  content: z.string().min(2)
  // TODO: Add max length and spam checks.
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = commentSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Gecersiz alanlar." }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      postId: params.id,
      userId: session.user.id,
      content: result.data.content
    }
  });

  return NextResponse.json({ id: comment.id });
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId: params.id,
        userId: session.user.id
      }
    }
  });

  if (existing) {
    await prisma.postLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.postLike.create({
      data: { postId: params.id, userId: session.user.id }
    });
  }

  const likeCount = await prisma.postLike.count({ where: { postId: params.id } });

  return NextResponse.json({ liked: !existing, likeCount });
}

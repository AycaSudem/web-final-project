import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post-card";

export default async function PostsPage() {
  const session = await getServerSession(authOptions);
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, comments: true, likes: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Posts</h1>
        <Link href="/posts/new" className="btn">
          New Post
        </Link>
      </div>
      <div className="grid gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} canDelete={session?.user?.id === post.userId} />
        ))}
      </div>
    </div>
  );
}

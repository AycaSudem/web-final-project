import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PostActions } from "@/components/post-actions";
import { CommentForm } from "@/components/comment-form";

interface PostDetailPageProps {
  params: { id: string };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const session = await getServerSession(authOptions);
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      comments: { include: { user: true }, orderBy: { createdAt: "desc" } },
      likes: true
    }
  });

  if (!post) {
    return <p>Post not found.</p>;
  }

  const isOwner = session?.user?.id === post.userId;
  const liked = post.likes.some((like) => like.userId === session?.user?.id);
  const canLike = Boolean(session?.user?.id);

  return (
    <div className="space-y-6">
      <Link href="/posts" className="text-sm text-ink/60">
        ← Back to posts
      </Link>

      <article className="card space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">{post.title}</h1>
            <p className="text-sm text-ink/60">
              {post.user.name} • {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
          <PostActions
            postId={post.id}
            initialLikeCount={post.likes.length}
            initialLiked={liked}
            canDelete={isOwner}
            canLike={canLike}
          />
        </div>
        <p className="text-sm text-ink/80 whitespace-pre-line">{post.content}</p>
      </article>

      <section className="space-y-5">
        <h2 className="text-lg font-semibold md:text-xl">Yorumlar</h2>
        {session ? (
          <CommentForm postId={post.id} />
        ) : (
          <p className="text-sm text-ink/60">
            Yorum eklemek icin <Link href="/login" className="text-accent">login</Link> olmalisin.
          </p>
        )}
        <div className="space-y-3">
          {post.comments.map((comment) => (
            <div key={comment.id} className="card">
              <p className="text-sm text-ink/80">{comment.content}</p>
              <p className="mt-2 text-xs text-ink/60">
                {comment.user.name} • {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

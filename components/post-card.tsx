import Link from "next/link";
import type { Post, User, PostLike, Comment } from "@prisma/client";
import { PostDeleteButton } from "@/components/post-delete-button";

interface PostCardProps {
  post: Post & { user: User; likes: PostLike[]; comments: Comment[] };
  canDelete?: boolean;
}

export function PostCard({ post, canDelete }: PostCardProps) {
  return (
    <article className="card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          <Link href={`/posts/${post.id}`} className="hover:text-accent">
            {post.title}
          </Link>
        </h3>
        <div className="flex items-center gap-3">
          {canDelete ? <PostDeleteButton postId={post.id} /> : null}
          <span className="text-xs text-ink/60">{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink/80">{post.content}</p>
      <div className="mt-4 flex items-center gap-4 text-xs text-ink/60">
        <span>By {post.user.name}</span>
        <span>{post.comments.length} comments</span>
        <span>{post.likes.length} likes</span>
      </div>
    </article>
  );
}

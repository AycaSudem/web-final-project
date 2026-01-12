import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PostForm } from "@/components/post-form";

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">New Post</h1>
        <p className="text-sm text-ink/60">
          Post olusturmak icin <Link href="/login" className="text-accent">login</Link> olmalisin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">New Post</h1>
      <PostForm />
    </div>
  );
}

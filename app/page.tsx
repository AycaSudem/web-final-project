import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post-card";
import { EventCard } from "@/components/event-card";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { user: true, comments: true, likes: true }
  });

  const events = await prisma.event.findMany({
    orderBy: { startDateTime: "asc" },
    take: 3,
    include: { creator: true }
  });

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="glass-panel relative overflow-hidden">
          <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-accent/20 blur-2xl" />
          <div className="absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-teal/20 blur-2xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-ink/60">
                <span className="accent-dot" />
                Campus tech + AI
              </div>
              <h1 className="text-3xl font-bold md:text-4xl">Campus Loop</h1>
              <p className="text-sm text-ink/70 md:text-base">
                Öğrenciler, kulüpler ve etkinlikler için neşeli ve modern bir kampüs teknolojisi ağı.
              </p>
            </div>
            <Link href="/posts/new" className="btn">
              Yeni Post
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} canDelete={session?.user?.id === post.userId} />
          ))}
        </div>
        <Link href="/posts" className="text-sm font-medium text-accent">
          Tüm postlar →
        </Link>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Yaklaşan Etkinlikler</h2>
          <Link href="/events/new" className="btn-secondary">
            Etkinlik Ekle
          </Link>
        </div>
        <div className="grid gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        <Link href="/events" className="text-sm font-medium text-accent">
          Tüm etkinlikler →
        </Link>
      </section>
    </div>
  );
}

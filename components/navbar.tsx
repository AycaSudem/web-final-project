"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-black/10 bg-white/70 shadow-sm backdrop-blur">
      <div className="container-app flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-ink">
            <img src="/logo.svg" alt="Campus Loop logo" className="h-9 w-9" />
            <span>Campus Loop</span>
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link
              href="/"
              className="relative hover:text-accent after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-accent after:transition-all hover:after:w-full"
            >
              Home
            </Link>
            <Link
              href="/posts"
              className="relative hover:text-accent after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-accent after:transition-all hover:after:w-full"
            >
              Posts
            </Link>
            <Link
              href="/events"
              className="relative hover:text-accent after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-accent after:transition-all hover:after:w-full"
            >
              Events
            </Link>
            <Link
              href="/posts/new"
              className="relative hover:text-accent after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-accent after:transition-all hover:after:w-full"
            >
              New Post
            </Link>
            <Link
              href="/events/new"
              className="relative hover:text-accent after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-accent after:transition-all hover:after:w-full"
            >
              New Event
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {session ? (
            <>
              <span className="text-ink/70">{session.user?.name ?? session.user?.email}</span>
              <button
                className="btn-secondary"
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">
                Login
              </Link>
              <Link href="/register" className="btn">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

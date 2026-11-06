"use client";

import Image from "next/image";
import Link from "next/link";
import { Camera, Pencil } from "lucide-react";
import { useFeedHydrated } from "@/lib/feed/use-feed-hydrated";
import { PROFILE } from "@/lib/profile/profile-data";
import { cn } from "@/lib/utils";
import { useFeedStore } from "@/store/feed-store";

export type ProfileTab = "posts" | "learning";

/** Tabs that switch what the main column shows. */
const TABS: { id: ProfileTab; label: string }[] = [
  { id: "posts", label: "Posts" },
  { id: "learning", label: "Learning" },
];

/** Tabs that open their own page. */
const PAGE_LINKS = [
  { href: "/admin/profile/about", label: "About" },
  { href: "/admin/profile/dashboard", label: "Dashboard" },
  { href: "/admin/profile/book-review", label: "Book Review" },
];

const tabCls = (active: boolean) =>
  cn(
    "relative shrink-0 whitespace-nowrap rounded-lg px-4 py-3.5 text-sm font-semibold transition-colors",
    active
      ? "text-black after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:rounded-full after:bg-black dark:text-white dark:after:bg-white"
      : "text-black/60 hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/10",
  );

/** Cover photo, big profile photo, name and the tab bar, laid out like a Facebook profile. */
export function ProfileHeader({ tab, onTab }: { tab: ProfileTab; onTab: (tab: ProfileTab) => void }) {
  const hydrated = useFeedHydrated();
  const friends = useFeedStore((s) => s.friends.length);
  const posts = useFeedStore((s) => s.myPosts.length);

  return (
    <section className="theme-card overflow-hidden shadow-[0_24px_70px_rgba(15,23,42,0.28)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_20px_80px_rgba(0,0,0,0.35)]">
      {/* Cover */}
      <div className="relative h-44 overflow-hidden sm:h-60 lg:h-72">
        <Image
          src={PROFILE.coverUrl}
          alt="Cover photo"
          fill
          priority
          sizes="(min-width: 1152px) 1100px, 100vw"
          className="object-cover"
        />
        {/* Soft scrim so the button stays readable over any photo */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/10" />
        <button
          type="button"
          className="rounded-full border border-border font-medium text-black dark:text-white transition-colors hover:bg-muted absolute bottom-3 right-4 z-10 flex items-center gap-2 bg-white/90 px-3 py-1.5 text-xs backdrop-blur-sm dark:bg-black/40"
        >
          <Camera className="h-3.5 w-3.5" />
          Edit cover photo
        </button>
      </div>

      {/* Photo, name, stats */}
      <div className="px-5 pb-4 sm:px-8">
        <div className="-mt-16 flex flex-col items-center gap-4 sm:-mt-20 sm:flex-row sm:items-start">
          <div className="relative z-10 size-32 shrink-0 overflow-hidden rounded-full border-4 border-card bg-card shadow-lg sm:size-40">
            <Image src={PROFILE.avatarUrl} alt="Profile photo" fill sizes="160px" className="object-cover" />
          </div>

          <div className="relative z-10 min-w-0 flex-1 text-center sm:pt-[5.5rem] sm:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white sm:text-3xl">{PROFILE.name}</h1>
            <p className="mt-1 text-sm text-black/60 dark:text-white/50">
              {PROFILE.field} · {PROFILE.availability} ·{" "}
              <span className="font-medium text-emerald-500 dark:text-emerald-400">{PROFILE.completion}% complete</span>
            </p>
            <p className="mt-1 min-h-5 text-sm font-medium text-black/80 dark:text-white/70">
              {hydrated && (
                <>
                  <Link href="/feed/friends" className="hover:underline">
                    {friends} {friends === 1 ? "friend" : "friends"}
                  </Link>{" "}
                  · {posts} {posts === 1 ? "post" : "posts"}
                </>
              )}
            </p>
          </div>

          <button
            type="button"
            className="rounded-full border border-border bg-transparent font-medium text-foreground transition-colors hover:bg-muted relative z-10 flex items-center gap-2 self-center px-5 py-2.5 text-sm font-medium sm:mt-24 sm:self-start"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <nav
        aria-label="Profile sections"
        className="flex overflow-x-auto border-t border-gray-200 px-2 dark:border-white/10 sm:px-5"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => onTab(t.id)}
            className={tabCls(tab === t.id)}
          >
            {t.label}
          </button>
        ))}
        {PAGE_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={tabCls(false)}>
            {l.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}

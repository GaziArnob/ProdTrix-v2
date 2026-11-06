"use client";

import { useMemo } from "react";
import Link from "next/link";
import { SquarePen } from "lucide-react";
import { PostCard } from "@/components/feed/PostCard";
import { useFeedHydrated } from "@/lib/feed/use-feed-hydrated";
import { profilePostToFeedPost } from "@/lib/feed/my-posts";
import { useFeedStore } from "@/store/feed-store";

const SHOWN = 5;

/** Your posts as the same cards you see in the feed. New posts are written with the box above. */
export function ProfilePosts() {
  const hydrated = useFeedHydrated();
  const posts = useFeedStore((s) => s.myPosts);
  const shown = useMemo(() => posts.slice(0, SHOWN).map(profilePostToFeedPost), [posts]);
  const more = posts.length - shown.length;

  return (
    <section aria-labelledby="profile-posts" className="space-y-4">
      <div className="theme-card flex items-center gap-2 px-5 py-3.5">
        <SquarePen className="h-4 w-4 text-pink-500 dark:text-pink-400" />
        <h2 id="profile-posts" className="text-sm font-semibold text-black dark:text-white">
          Posts
          {hydrated && posts.length > 0 && (
            <span className="ml-1.5 font-normal text-black/50 dark:text-white/40">({posts.length})</span>
          )}
        </h2>
      </div>

      {!hydrated ? (
        <div className="theme-card h-32 animate-pulse" aria-hidden />
      ) : posts.length === 0 ? (
        <p className="theme-card px-6 py-10 text-center text-sm text-black/60 dark:text-white/40">
          You haven’t posted anything yet. Use the box above to share your first post.
        </p>
      ) : (
        <>
          {shown.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {more > 0 && (
            <Link
              href="/admin/profile/add-post"
              className="theme-card block px-5 py-3 text-center text-sm font-medium text-black/70 hover:underline dark:text-white/60"
            >
              See all {posts.length} posts
            </Link>
          )}
        </>
      )}
    </section>
  );
}

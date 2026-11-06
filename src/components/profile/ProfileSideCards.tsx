"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Briefcase, Gauge, Mail } from "lucide-react";
import { AttachmentThumb } from "@/components/profile/PostAttachments";
import { CreatorAvatar } from "@/components/feed/CreatorAvatar";
import { getCreator } from "@/data/feed-data";
import type { FeedCreator } from "@/interfaces/feed.interface";
import { useFeedHydrated } from "@/lib/feed/use-feed-hydrated";
import { attachmentKind } from "@/lib/profile/attachments";
import { PROFILE } from "@/lib/profile/profile-data";
import { useFeedStore } from "@/store/feed-store";

const cardTitle = "text-lg font-bold text-black dark:text-white";
const mutedText = "text-sm text-black/60 dark:text-white/50";

/** Short facts about the person, like Facebook's "Intro" card. */
export function ProfileIntro() {
  const rows = [
    { icon: Briefcase, text: `${PROFILE.field} · ${PROFILE.availability}`, tone: "" },
    { icon: Mail, text: PROFILE.email, tone: "" },
    { icon: BadgeCheck, text: PROFILE.status, tone: "text-emerald-500 dark:text-emerald-400" },
    { icon: Gauge, text: `Profile ${PROFILE.completion}% complete`, tone: "" },
  ];

  return (
    <section className="theme-card space-y-4 p-5">
      <h2 className={cardTitle}>Intro</h2>
      <p className="text-center text-sm italic text-black/70 dark:text-white/60">“{PROFILE.bio}”</p>
      <ul className="space-y-3 text-sm">
        {rows.map(({ icon: Icon, text, tone }) => (
          <li key={text} className="flex items-center gap-3 text-black dark:text-white">
            <Icon className="h-5 w-5 shrink-0 text-black/50 dark:text-white/40" />
            <span className={`min-w-0 break-words ${tone}`}>{text}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/admin/profile/about"
        className="theme-button-secondary flex w-full items-center justify-center py-2.5 text-sm font-medium"
      >
        See full About
      </Link>
    </section>
  );
}

/** A grid of the photos you have attached to your posts. */
export function ProfilePhotos() {
  const hydrated = useFeedHydrated();
  const posts = useFeedStore((s) => s.myPosts);
  const photos = posts
    .flatMap((p) => p.attachments ?? [])
    .filter((a) => attachmentKind(a.type) === "image")
    .slice(0, 9);

  return (
    <section className="theme-card space-y-3 p-5">
      <h2 className={cardTitle}>Photos</h2>
      {!hydrated ? (
        <div className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5" aria-hidden />
      ) : photos.length === 0 ? (
        <p className={mutedText}>Photos you add to your posts will show up here.</p>
      ) : (
        <div className="grid grid-cols-3 gap-1.5 overflow-hidden rounded-xl">
          {photos.map((a) => (
            <AttachmentThumb key={a.id} attachment={a} />
          ))}
        </div>
      )}
    </section>
  );
}

/** Your friends, shown as a small grid with a link to the full Friends page. */
export function ProfileFriends() {
  const hydrated = useFeedHydrated();
  const ids = useFeedStore((s) => s.friends);
  const friends = ids.map(getCreator).filter((c): c is FeedCreator => Boolean(c));

  return (
    <section className="theme-card space-y-3 p-5">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className={cardTitle}>Friends</h2>
        <Link href="/feed/friends" className="text-sm font-medium text-black/60 hover:underline dark:text-white/50">
          See all
        </Link>
      </div>

      {!hydrated ? (
        <div className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5" aria-hidden />
      ) : friends.length === 0 ? (
        <p className={mutedText}>
          No friends yet.{" "}
          <Link href="/feed/friends" className="font-medium text-black underline-offset-2 hover:underline dark:text-white">
            Find people to add
          </Link>
          .
        </p>
      ) : (
        <>
          <p className={mutedText}>
            {friends.length} {friends.length === 1 ? "friend" : "friends"}
          </p>
          <ul className="grid grid-cols-3 gap-3">
            {friends.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link href={`/feed/creator/${c.id}`} className="flex flex-col items-center gap-1.5 text-center">
                  <CreatorAvatar creator={c} size={64} />
                  <span className="w-full truncate text-xs font-medium text-black dark:text-white">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

/** Small round profile photo used next to the "What's on your mind?" box. */
export function MyAvatar({ size = 40 }: { size?: number }) {
  return (
    <span
      className="relative inline-block shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10"
      style={{ width: size, height: size }}
    >
      <Image src={PROFILE.avatarUrl} alt="" fill sizes={`${size}px`} className="object-cover" />
    </span>
  );
}

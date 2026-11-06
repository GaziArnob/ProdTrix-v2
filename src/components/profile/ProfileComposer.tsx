import Link from "next/link";
import { ImagePlus, SquarePen } from "lucide-react";
import { MyAvatar } from "@/components/profile/ProfileSideCards";
import { PROFILE } from "@/lib/profile/profile-data";

const actionCls =
  "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-black/70 transition-colors hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10";

/** The "What's on your mind?" box. It opens the Add Post page. */
export function ProfileComposer() {
  const firstName = PROFILE.name.split(" ")[0];

  return (
    <section className="theme-card p-4">
      <div className="flex items-center gap-3">
        <MyAvatar />
        <Link
          href="/admin/profile/add-post"
          className="min-w-0 flex-1 truncate rounded-full bg-gray-100 px-4 py-2.5 text-left text-sm text-black/60 transition-colors hover:bg-gray-200 dark:bg-white/10 dark:text-white/50 dark:hover:bg-white/15"
        >
          What’s on your mind, {firstName}?
        </Link>
      </div>
      <div className="mt-3 flex gap-1 border-t border-gray-200 pt-2 dark:border-white/10">
        <Link href="/admin/profile/add-post" className={actionCls}>
          <SquarePen className="h-5 w-5 text-pink-500 dark:text-pink-400" />
          Add Post
        </Link>
        <Link href="/admin/profile/add-post" className={actionCls}>
          <ImagePlus className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
          Photo / video
        </Link>
      </div>
    </section>
  );
}

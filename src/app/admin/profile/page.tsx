"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Plus,
  BookOpen,
  Lightbulb,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  StickyNote,
} from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import BookNoteForm, { type BookNoteInput } from "@/components/book-note-form";
import { ProfileComposer } from "@/components/profile/ProfileComposer";
import { ProfileHeader, type ProfileTab } from "@/components/profile/ProfileHeader";
import { ProfilePosts } from "@/components/profile/ProfilePosts";
import { ProfileFriends, ProfileIntro, ProfilePhotos } from "@/components/profile/ProfileSideCards";

// ── Data ──────────────────────────────────────────────────────────────────────
type CarouselItem = { name: string; image: string };

const initialCourseItems: CarouselItem[] = [
  { name: "C++", image: "https://picsum.photos/seed/course-cpp/300/300" },
  { name: "C#", image: "https://picsum.photos/seed/course-csharp/300/300" },
  {
    name: "AI Fundamentals",
    image: "https://picsum.photos/seed/course-ai/300/300",
  },
];

const initialBookItems: CarouselItem[] = [
  {
    name: "Clean Code",
    image: "https://picsum.photos/seed/book-cleancode/300/300",
  },
  {
    name: "The Pragmatic Programmer",
    image: "https://picsum.photos/seed/book-pragmatic/300/300",
  },
];

const initialIdeaItems: CarouselItem[] = [
  {
    name: "Build a SaaS",
    image: "https://picsum.photos/seed/idea-saas/300/300",
  },
  {
    name: "Open source CLI tool",
    image: "https://picsum.photos/seed/idea-cli/300/300",
  },
];

const NOTE_TYPE_OPTIONS = [
  { value: "course", label: "Course" },
  { value: "book", label: "Book" },
  { value: "idea", label: "Idea / Plan" },
];

// ── Auto-scrolling Carousel (with manual nav buttons) ────────────────────────
function ItemCarousel({
  items,
  accentColor,
}: {
  items: CarouselItem[];
  accentColor: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const isWrappingRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll via rAF; when reaching the end, smoothly wrap back to start.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || items.length === 0) return;

    let rafId: number;
    const speed = 0.4; // px per frame (~24px/s)

    const wrapBack = () => {
      isWrappingRef.current = true;
      el.scrollTo({ left: 0, behavior: "smooth" });
      // Resume forward scrolling once the wrap animation finishes
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = setTimeout(() => {
        isWrappingRef.current = false;
      }, 600);
    };

    const step = () => {
      if (el && !pausedRef.current && !isWrappingRef.current) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll <= 0) {
          // Nothing to scroll (track fits inside the container)
        } else if (el.scrollLeft >= maxScroll - 1) {
          wrapBack();
        } else {
          el.scrollLeft += speed;
        }
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [items.length]);

  const pauseThenResume = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 1800);
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    pauseThenResume();
    const maxScroll = el.scrollWidth - el.clientWidth;

    // At the right edge and pressing right → wrap back to start
    if (direction === 1 && el.scrollLeft >= maxScroll - 1) {
      isWrappingRef.current = true;
      el.scrollTo({ left: 0, behavior: "smooth" });
      resumeTimeoutRef.current = setTimeout(() => {
        isWrappingRef.current = false;
      }, 600);
      return;
    }

    // At the left edge and pressing left → jump to the end
    if (direction === -1 && el.scrollLeft <= 0) {
      el.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    const firstCard = el.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard ? firstCard.offsetWidth + 12 : 200;
    el.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      {/* Left button */}
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label="Scroll left"
        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full border border-gray-300 dark:border-white/10 bg-white/90 dark:bg-black/50 backdrop-blur-sm shadow-md shadow-gray-400/50 dark:shadow-none flex items-center justify-center hover:bg-white dark:hover:bg-black/70 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-white/70" />
      </button>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="flex gap-3 overflow-x-auto no-scrollbar w-full px-9"
      >
        {items.map((item) => (
          <div
            key={item.name}
            className="shrink-0 w-1/2 lg:w-1/4 h-[100px] border border-gray-300 dark:border-white/10 rounded-xl flex items-stretch overflow-hidden hover:border-gray-400 dark:hover:border-white/20 transition-colors bg-white dark:bg-white/5 shadow-xl shadow-gray-400/50 dark:shadow-none"
          >
            {/* Square photo — left */}
            <div className="relative w-[100px] h-[100px] shrink-0 self-center">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="100px"
                className="object-cover rounded-lg"
              />
            </div>

            {/* Name — right */}
            <div className="flex-1 flex flex-col justify-center gap-2 p-3 min-w-0">
              <span
                className={`font-medium text-sm leading-snug ${accentColor} truncate`}
              >
                {item.name}
              </span>
              <span className="text-[10px] text-black dark:text-white/20 uppercase tracking-widest">
                Active
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Right button */}
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="Scroll right"
        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full border border-gray-300 dark:border-white/10 bg-white/90 dark:bg-black/50 backdrop-blur-sm shadow-md shadow-gray-400/50 dark:shadow-none flex items-center justify-center hover:bg-white dark:hover:bg-black/70 transition-colors"
      >
        <ChevronRight className="h-4 w-4 text-gray-600 dark:text-white/70" />
      </button>
    </div>
  );
}

// ── Content Column ────────────────────────────────────────────────────────────
function ContentColumn({
  title,
  icon,
  items,
  accentColor,
  className = "",
  open,
  onOpenChange,
  onSubmitNote,
  noteTypeOptions,
  defaultNoteType,
  submitLabel = "OK",
}: {
  title: string;
  icon: React.ReactNode;
  items: CarouselItem[];
  accentColor: string;
  className?: string;
  /** Controlled Sheet modal open state */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with the submitted note; also closes the modal */
  onSubmitNote: (note: BookNoteInput) => void;
  /** Optional "Note Type" selector shown inside the modal */
  noteTypeOptions?: { value: string; label: string }[];
  /** Category used when no Note Type selector is rendered (e.g. per-container modals) */
  defaultNoteType?: string;
  submitLabel?: string;
}) {
  return (
    <div className={`theme-card p-5 flex flex-col gap-3 h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-gray-200 dark:border-white/10">
        {icon}
        <h3 className="font-semibold text-black dark:text-white text-sm">
          {title}
        </h3>
      </div>

      {/* Add Button – opens BookNoteForm in a Sheet modal */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="theme-button-secondary flex items-center justify-center gap-2 w-full py-3 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add {title}</span>
          </button>
        </SheetTrigger>
        <SheetContent side="center">
          <SheetHeader className="px-10">
            <SheetTitle>Add a new note</SheetTitle>
            <SheetDescription>Create a new BookNote entry.</SheetDescription>
          </SheetHeader>
          <BookNoteForm
            modal={true}
            submitLabel={submitLabel}
            noteTypeOptions={noteTypeOptions}
            defaultNoteType={defaultNoteType}
            onSubmitValue={onSubmitNote}
            onSuccess={() => onOpenChange(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Items — auto-scrolling carousel */}
      <ItemCarousel items={items} accentColor={accentColor} />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [tab, setTab] = useState<ProfileTab>("posts");

  // Category lists (seeded with the initial constants) so added notes persist in-session
  const [courseItems, setCourseItems] =
    useState<CarouselItem[]>(initialCourseItems);
  const [bookItems, setBookItems] = useState<CarouselItem[]>(initialBookItems);
  const [ideaItems, setIdeaItems] = useState<CarouselItem[]>(initialIdeaItems);

  // Controlled Sheet modal open states
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [ideaModalOpen, setIdeaModalOpen] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);

  // All notes combined (Course + Book + Idea / Plan) for the Notes container
  const allNotes: CarouselItem[] = [...courseItems, ...bookItems, ...ideaItems];

  // Route an added note to the correct category list
  const addNote = (note: BookNoteInput) => {
    const newItem: CarouselItem = {
      name: note.title,
      image: note.image,
    };
    const type = note.noteType ?? "course";
    if (type === "course") {
      setCourseItems((prev) => [...prev, newItem]);
    } else if (type === "book") {
      setBookItems((prev) => [...prev, newItem]);
    } else if (type === "idea") {
      setIdeaItems((prev) => [...prev, newItem]);
    }
  };

  const contentColumnProps = {
    onSubmitNote: addNote,
    className: "w-full",
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:px-6">
        <ProfileHeader tab={tab} onTab={setTab} />

        {/* On a phone: intro, then the posts, then photos and friends. On a big screen: info on the left, posts on the right. */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <aside className="contents lg:flex lg:w-[22rem] lg:shrink-0 lg:flex-col lg:gap-4">
            <div className="order-1 lg:order-none">
              <ProfileIntro />
            </div>
            <div className="order-3 space-y-4 lg:order-none">
              <ProfilePhotos />
              <ProfileFriends />
            </div>
          </aside>

          <div className="order-2 min-w-0 flex-1 space-y-4 lg:order-none">
            {tab === "posts" ? (
              <>
                <ProfileComposer />
                <ProfilePosts />
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <ContentColumn
                  {...contentColumnProps}
                  title="Course"
                  icon={<GraduationCap className="h-4 w-4 text-blue-500 dark:text-blue-400" />}
                  items={courseItems}
                  accentColor="text-blue-500 dark:text-blue-400"
                  open={courseModalOpen}
                  onOpenChange={setCourseModalOpen}
                  defaultNoteType="course"
                  submitLabel="Add Course"
                />

                {/* Notes container – shows all notes (Course + Book + Idea/Plan) */}
                <ContentColumn
                  {...contentColumnProps}
                  title="Notes"
                  icon={<StickyNote className="h-4 w-4 text-violet-500 dark:text-violet-400" />}
                  items={allNotes}
                  accentColor="text-violet-500 dark:text-violet-400"
                  open={notesModalOpen}
                  onOpenChange={setNotesModalOpen}
                  noteTypeOptions={NOTE_TYPE_OPTIONS}
                  submitLabel="Add Note"
                />

                <ContentColumn
                  {...contentColumnProps}
                  title="Book"
                  icon={<BookOpen className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />}
                  items={bookItems}
                  accentColor="text-emerald-500 dark:text-emerald-400"
                  open={bookModalOpen}
                  onOpenChange={setBookModalOpen}
                  defaultNoteType="book"
                  submitLabel="Add Book"
                />
                <ContentColumn
                  {...contentColumnProps}
                  title="Idea / Plan"
                  icon={<Lightbulb className="h-4 w-4 text-amber-500 dark:text-amber-400" />}
                  items={ideaItems}
                  accentColor="text-amber-500 dark:text-amber-400"
                  open={ideaModalOpen}
                  onOpenChange={setIdeaModalOpen}
                  defaultNoteType="idea"
                  submitLabel="Add Idea"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

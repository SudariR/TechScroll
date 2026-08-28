"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inbox, X } from "lucide-react";
import { ExplainerClip } from "../../types/schema";
import { FeedRange } from "../../lib/api";
import { ClipPlayer } from "../engine/ClipPlayer";
import { ScrollHint } from "./ScrollHint";
import { useActiveClip } from "../../hooks/UseActiveClip";
import { ClipSkeleton } from "./ClipSkeleton";
import { FeedHeader } from "./FeedHeader";
import { AmbientBackground } from "../visual/AmbientBackground";

/** How many clips to keep mounted on each side of the active one. */
const WINDOW_RADIUS = 1;

interface Props {
  clips: ExplainerClip[];
  range?: FeedRange;
  counts?: { today: number; week: number; all: number };
}

export const ClipFeed: React.FC<Props> = ({ clips, range = 'today', counts }) => {
  const router = useRouter();
  const [noticeDismissed, setNoticeDismissed] = useState(false);

  const { containerRef, activeIndex, scrollToClip } = useActiveClip(
    clips.length,
  );

  // Escape key handler to return to landing page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.push("/");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  // Check if active range is 'today' but the newest clip is older than today
  const isWidened = useMemo(() => {
    if (range !== "today" || clips.length === 0) return false;
    const newestPublishedAt = clips[0]?.publishedAt;
    if (!newestPublishedAt) return false;
    const pubDate = new Date(newestPublishedAt);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return pubDate < startOfToday;
  }, [range, clips]);

  // If clips array is empty, render centered empty state without scroll container, dot rail or scroll hint
  if (clips.length === 0) {
    return (
      <div className="relative min-h-screen w-full bg-ink-950 overflow-hidden flex flex-col">
        <AmbientBackground variant="feed" />
        <FeedHeader current={0} total={0} range={range} counts={counts} />
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Inbox className="w-10 h-10 text-fg-dim mb-3" />
          <p className="text-sm text-fg-muted mb-4">
            No explainers in this range yet
          </p>
          <Link
            href="/feed?range=all"
            className="inline-flex items-center px-4 py-2 rounded-lg border border-ink-800 bg-ink-900/60 text-xs font-medium text-fg hover:bg-ink-800 hover:text-white transition-colors"
          >
            View all explainers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-ink-950 overflow-hidden">
      {/* 1. Ambient Background for Feed */}
      <AmbientBackground variant="feed" />

      {/* 2. Top Navigation Header */}
      <FeedHeader
        current={activeIndex + 1}
        total={clips.length}
        range={range}
        counts={counts}
      />

      {/* 3. Main Feed Scroll Container */}
      <div className="relative z-10">
        <div
          ref={containerRef}
          className="h-screen w-full overflow-y-scroll snap-y snap-mandatory
                     scroll-smooth
                     [scrollbar-width:none] [-ms-overflow-style:none]
                     [&::-webkit-scrollbar]:hidden"
        >
          {clips.map((clip, i) => {
            const isMounted = Math.abs(i - activeIndex) <= WINDOW_RADIUS;

            return (
              <section
                key={clip.id}
                data-clip-index={i}
                className="relative h-screen w-full snap-start snap-always
                           flex flex-col items-center justify-center p-4 pt-16"
              >
                {i === 0 && isWidened && !noticeDismissed && (
                  <div className="absolute top-18 z-30 flex items-center gap-2 text-[11px] text-fg-dim bg-ink-900/60 border border-ink-800 rounded-full px-3 py-1 backdrop-blur-sm shadow-md">
                    <span>
                      Showing recent explainers — nothing new published today yet.
                    </span>
                    <button
                      onClick={() => setNoticeDismissed(true)}
                      className="hover:text-fg transition-colors cursor-pointer text-fg-dim"
                      aria-label="Dismiss notice"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {isMounted ? (
                  <ClipPlayer
                    clip={clip}
                    isActive={i === activeIndex}
                    onComplete={() => scrollToClip(i + 1)}
                  />
                ) : (
                  <ClipSkeleton title={clip.title} />
                )}
              </section>
            );
          })}
        </div>

        {/* 4. Dot Rail with Hover Tooltip and Glow */}
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5">
          {clips.map((clip, i) => (
            <div
              key={clip.id}
              className="relative group flex items-center justify-end"
            >
              {/* Tooltip */}
              <div className="absolute right-6 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap px-2.5 py-1 rounded-md bg-ink-900/95 border border-ink-800 text-[11px] text-fg font-medium shadow-xl backdrop-blur-sm">
                {clip.title}
              </div>

              {/* Dot */}
              <button
                onClick={() => scrollToClip(i)}
                aria-label={`Go to clip ${i + 1}: ${clip.title}`}
                className={`w-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "h-6 bg-accent shadow-[0_0_12px_rgba(178,255,61,0.6)]"
                    : "h-1.5 bg-ink-700 hover:bg-ink-500"
                }`}
              />
            </div>
          ))}
        </div>

        <ScrollHint show={activeIndex === 0} />
      </div>
    </div>
  );
};

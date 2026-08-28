"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExplainerClip } from "../../types/schema";
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
}

export const ClipFeed: React.FC<Props> = ({ clips }) => {
  const router = useRouter();
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

  return (
    <div className="relative min-h-screen w-full bg-ink-950 overflow-hidden">
      {/* 1. Ambient Background for Feed */}
      <AmbientBackground variant="feed" />

      {/* 2. Top Navigation Header */}
      <FeedHeader current={activeIndex + 1} total={clips.length} />

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
                className="h-screen w-full snap-start snap-always
                           flex items-center justify-center p-4 pt-16"
              >
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

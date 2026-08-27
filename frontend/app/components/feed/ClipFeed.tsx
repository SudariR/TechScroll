"use client";

import React from "react";
import { ExplainerClip } from "../../types/schema";
import { ClipPlayer } from "../engine/ClipPlayer";
import { ScrollHint } from "./ScrollHint";
import { useActiveClip } from "../../hooks/UseActiveClip";

interface Props {
  clips: ExplainerClip[];
}

export const ClipFeed: React.FC<Props> = ({ clips }) => {
  const { containerRef, activeIndex, scrollToClip } = useActiveClip(
    clips.length,
  );

  return (
    <>
      <div
        ref={containerRef}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory
                   scroll-smooth bg-ink-950
                   [scrollbar-width:none] [-ms-overflow-style:none]
                   [&::-webkit-scrollbar]:hidden"
      >
        {clips.map((clip, i) => (
          <section
            key={clip.id}
            data-clip-index={i}
            className="h-screen w-full snap-start snap-always
                       flex items-center justify-center p-4"
          >
            <ClipPlayer
              clip={clip}
              isActive={i === activeIndex}
              onComplete={() => scrollToClip(i + 1)}
            />
          </section>
        ))}
      </div>

      {/* position rail */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {clips.map((clip, i) => (
          <button
            key={clip.id}
            onClick={() => scrollToClip(i)}
            aria-label={`Go to clip ${i + 1}`}
            className={`w-1.5 rounded-full transition-all duration-300
              ${
                i === activeIndex
                  ? "h-6 bg-accent"
                  : "h-1.5 bg-ink-700 hover:bg-ink-600"
              }`}
          />
        ))}
      </div>

      <ScrollHint show={activeIndex === 0} />
    </>
  );
};

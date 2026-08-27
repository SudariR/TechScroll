"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ExplainerClip } from "../../types/schema";
import { SceneRenderer } from "./SceneRenderer";
import { SceneProgress } from "./SceneProgress";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Lightbulb,
} from "lucide-react";

const DEFAULT_DURATION = 5;
const END_HOLD = 2; // extra seconds on the last scene so the takeaway is readable

interface Props {
  clip: ExplainerClip;
  isActive?: boolean;
  onComplete?: () => void;
}

export const ClipPlayer: React.FC<Props> = ({
  clip,
  isActive = true,
  onComplete,
}) => {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const total = clip.scenes.length;
  const scene = clip.scenes[index];
  const duration = scene?.duration ?? DEFAULT_DURATION;

  const next = useCallback(
    () => setIndex((i) => Math.min(i + 1, total - 1)),
    [total],
  );
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  /* reset when scrolled out of view */
  useEffect(() => {
    if (!isActive) {
      setIndex(0);
      setIsPlaying(true);
    }
  }, [isActive]);

  /* auto-advance scenes, then hand off to the parent */
  useEffect(() => {
    if (!isActive || !isPlaying) return;

    const isLast = index >= total - 1;
    const wait = (isLast ? duration + END_HOLD : duration) * 1000;

    const timer = setTimeout(() => {
      if (isLast) {
        onComplete?.();
      } else {
        next();
      }
    }, wait);

    return () => clearTimeout(timer);
  }, [index, isPlaying, isActive, duration, total, next, onComplete]);

  /* left / right arrows move between scenes */
  useEffect(() => {
    if (!isActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isActive, next, prev]);

  const atStart = index === 0;
  const atEnd = index === total - 1;
  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <SceneProgress
          total={total}
          currentIndex={index}
          duration={duration}
          isPlaying={isPlaying && isActive}
        />
        <div className="flex items-center justify-between text-[11px] text-fg-dim">
          <span className="font-semibold uppercase tracking-wider truncate pr-3">
            {clip.title}
          </span>
          <span className="tabular-nums shrink-0">
            {index + 1} / {total}
          </span>
        </div>
      </div>

      <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-ink-800 shadow-2xl">
        <SceneRenderer key={scene.id} scene={scene} isActive={isActive} />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={prev}
          disabled={atStart}
          aria-label="Previous scene"
          className="p-3 rounded-xl bg-ink-900 border border-ink-800 text-fg-muted hover:bg-ink-800 disabled:opacity-30 disabled:pointer-events-none transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsPlaying((p) => !p)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-ink-900 border border-ink-800 text-fg text-sm font-medium hover:bg-ink-800 transition"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          onClick={next}
          disabled={atEnd}
          aria-label="Next scene"
          className="p-3 rounded-xl bg-accent hover:bg-accent-bright text-ink-950 font-semibold disabled:opacity-30 disabled:pointer-events-none transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {atEnd && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-accent-soft border border-accent-border">
          <Lightbulb className="w-4 h-4 text-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] text-accent uppercase tracking-widest font-bold mb-1">
              Why It Matters
            </p>
            <p className="text-sm text-fg leading-relaxed">{clip.takeaway}</p>
          </div>
        </div>
      )}
    </div>
  );
};

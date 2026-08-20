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

interface Props {
  clip: ExplainerClip;
  isActive?: boolean; // is this clip the one on screen?
}

export const ClipPlayer: React.FC<Props> = ({ clip, isActive = true }) => {
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

  // Reset when the clip scrolls out of view (feed-ready behaviour)
  useEffect(() => {
    if (!isActive) {
      setIndex(0);
      setIsPlaying(true);
    }
  }, [isActive]);

  // Auto-advance
  useEffect(() => {
    if (!isActive || !isPlaying) return;
    if (index >= total - 1) return; // stop at the last scene

    const timer = setTimeout(next, duration * 1000);
    return () => clearTimeout(timer); // cleanup prevents ghost timers
  }, [index, isPlaying, isActive, duration, total, next]);

  // Keyboard navigation
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
      {/* header */}
      <div className="flex flex-col gap-2">
        <SceneProgress
          total={total}
          currentIndex={index}
          duration={duration}
          isPlaying={isPlaying && isActive}
        />
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-semibold uppercase tracking-wider truncate pr-3">
            {clip.title}
          </span>
          <span className="tabular-nums shrink-0">
            {index + 1} / {total}
          </span>
        </div>
      </div>

      {/* stage */}
      <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        {/* key={scene.id} forces a remount so entry animations replay */}
        <SceneRenderer key={scene.id} scene={scene} isActive={isActive} />
      </div>

      {/* controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={prev}
          disabled={atStart}
          aria-label="Previous scene"
          className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsPlaying((p) => !p)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm font-medium hover:bg-slate-800 transition"
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
          className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 disabled:pointer-events-none transition shadow-lg shadow-blue-600/20"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* takeaway reveals only at the end — it's the payoff */}
      {atEnd && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-950/30 border border-blue-500/20">
          <Lightbulb className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-1">
              Why It Matters
            </p>
            <p className="text-sm text-slate-200 leading-relaxed">
              {clip.takeaway}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

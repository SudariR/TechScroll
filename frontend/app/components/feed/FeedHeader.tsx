"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FeedRange } from "../../lib/api";

interface FeedHeaderProps {
  current: number;
  total: number;
  range?: FeedRange;
  counts?: { today: number; week: number; all: number };
}

const PILLS: { key: FeedRange; label: string; countKey: 'today' | 'week' | 'all' }[] = [
  { key: 'today', label: 'Today', countKey: 'today' },
  { key: 'week', label: 'This Week', countKey: 'week' },
  { key: 'all', label: 'All', countKey: 'all' },
];

export const FeedHeader: React.FC<FeedHeaderProps> = ({
  current,
  total,
  range = 'today',
  counts = { today: 0, week: 0, all: 0 },
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-ink-950/60 backdrop-blur-md border-b border-ink-800/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-fg hover:text-white transition-colors shrink-0"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5 text-fg-muted group-hover:text-fg" />
          <span className="font-display text-sm font-semibold tracking-tight hidden sm:inline">
            TechScroll
          </span>
        </Link>

        {/* Filter Pills */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          {PILLS.map((pill) => {
            const isActive = range === pill.key;
            const count = counts[pill.countKey] ?? 0;

            // Hide a pill entirely if its count is 0 AND it is not the active range
            if (count === 0 && !isActive) return null;

            return (
              <Link
                key={pill.key}
                href={`/feed?range=${pill.key}`}
                className={`text-[11px] rounded-full px-2.5 py-1 transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-accent text-ink-950 font-semibold"
                    : "border border-ink-800 text-fg-dim hover:text-fg hover:border-ink-700"
                }`}
              >
                <span>{pill.label}</span>
                <span
                  className={`hidden md:inline ml-1 font-normal ${
                    isActive ? "text-ink-950/80" : "text-fg-dim"
                  }`}
                >
                  ({count})
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="rounded-full border border-ink-800 px-2.5 py-1 bg-ink-900/60 shrink-0">
          <span className="text-[11px] tabular-nums text-fg-dim">
            {current} / {total}
          </span>
        </div>
      </div>
    </header>
  );
};

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface FeedHeaderProps {
  current: number;
  total: number;
}

export const FeedHeader: React.FC<FeedHeaderProps> = ({ current, total }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-ink-950/60 backdrop-blur-md border-b border-ink-800/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-fg hover:text-white transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5 text-fg-muted group-hover:text-fg" />
          <span className="font-display text-sm font-semibold tracking-tight">
            TechScroll
          </span>
        </Link>

        <div className="rounded-full border border-ink-800 px-2.5 py-1 bg-ink-900/60">
          <span className="text-[11px] tabular-nums text-fg-dim">
            {current} / {total}
          </span>
        </div>
      </div>
    </header>
  );
};

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Layers, Sparkles } from "lucide-react";
import { fetchThreads } from "../lib/api";
import { AmbientBackground } from "../components/visual/AmbientBackground";
import { Reveal } from "../components/visual/Reveal";
import { ImpactBadge } from "../components/engine/ImpactBadge";

export const dynamic = "force-dynamic";

function formatRelativeDate(dateStr?: string | Date): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - date.getTime());
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function ThreadsPage() {
  const threads = await fetchThreads();

  return (
    <main className="min-h-screen bg-ink-950 text-fg overflow-x-hidden relative flex flex-col">
      <AmbientBackground variant="landing" />

      {/* Top Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-ink-950/70 border-b border-ink-800/80">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
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

          <Link
            href="/feed"
            className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-ink-900/60 border border-ink-800 text-fg hover:border-ink-700 hover:bg-ink-800 transition-all"
          >
            Open Feed
          </Link>
        </div>
      </nav>

      {/* Page Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex-1 w-full flex flex-col">
        {/* Title & Description */}
        <Reveal>
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-accent-3-soft border border-accent-3/25">
              <Sparkles className="w-3.5 h-3.5 text-accent-3" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-3">
                Developing Stories
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-fg mb-3">
              Story Threads
            </h1>
            <p className="text-sm md:text-base text-fg-muted max-w-xl leading-relaxed">
              Follow evolving technology stories chronologically, with AI-generated continuity bridges between chapters.
            </p>
          </div>
        </Reveal>

        {/* Grid or Empty State */}
        {threads.length === 0 ? (
          <Reveal>
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border border-dashed border-ink-800/80 rounded-2xl bg-ink-900/20">
              <Layers className="w-10 h-10 text-fg-dim mb-3" />
              <p className="font-display text-lg font-semibold text-fg mb-1">
                No active story threads yet
              </p>
              <p className="text-sm text-fg-muted mb-6 max-w-md">
                Story threads form automatically when multiple explainers cover the same ongoing development.
              </p>
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-ink-950 text-xs font-semibold hover:bg-accent-bright transition-all"
              >
                Browse latest explainers <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {threads.map((t, idx) => (
              <Reveal key={t.storyKey} delay={idx * 0.05}>
                <Link
                  href={`/threads/${t.storyKey}`}
                  className="group relative flex flex-col justify-between p-5 rounded-2xl border border-ink-800 bg-ink-900/40 hover:border-ink-700 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden h-full"
                >
                  {/* Top-edge highlight */}
                  <div className="absolute top-0 left-5 right-5 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  <div>
                    {/* Eyebrow: Chapters count + relative date + Impact */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-accent-3">
                        {t.chapterCount} {t.chapterCount === 1 ? "Chapter" : "Chapters"}
                        <span className="text-ink-700 mx-1.5">·</span>
                        <span className="text-fg-dim font-normal">
                          {formatRelativeDate(t.latestPublishedAt)}
                        </span>
                      </span>

                      {t.topImpactScore != null && (
                        <ImpactBadge score={t.topImpactScore} />
                      )}
                    </div>

                    {/* Story Title */}
                    <h2 className="font-display text-lg font-bold text-fg group-hover:text-accent-3 transition-colors mb-2 leading-snug">
                      {t.storyLabel}
                    </h2>

                    {/* Latest Clip Title */}
                    <p className="text-xs text-fg-muted line-clamp-2 leading-relaxed mb-4">
                      {t.latestTitle}
                    </p>
                  </div>

                  {/* Entity Chips */}
                  {t.entities && t.entities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-ink-800/60 mt-auto">
                      {t.entities.slice(0, 3).map((entity) => (
                        <span
                          key={entity}
                          className="px-2 py-0.5 rounded-md border border-ink-800 bg-ink-950/60 text-[10px] text-fg-dim"
                        >
                          {entity}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-ink-800 py-6 text-center text-xs text-fg-dim mt-auto">
        TechScroll Threads — tracking developing storylines across time.
      </footer>
    </main>
  );
}

import React from "react";
import Link from "next/link";
import { ArrowLeft, Inbox } from "lucide-react";
import { fetchThread } from "../../lib/api";
import { ClipFeed } from "../../components/feed/ClipFeed";
import { AmbientBackground } from "../../components/visual/AmbientBackground";

export const dynamic = "force-dynamic";

interface ThreadDetailPageProps {
  params: Promise<{ storyKey: string }>;
}

export default async function ThreadDetailPage({ params }: ThreadDetailPageProps) {
  const { storyKey } = await params;
  const clips = await fetchThread(storyKey);

  // If no clips found, show centered empty state
  if (!clips || clips.length === 0) {
    return (
      <main className="relative min-h-screen w-full bg-ink-950 overflow-hidden flex flex-col">
        <AmbientBackground variant="landing" />

        {/* Minimal Nav Header */}
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-ink-950/70 border-b border-ink-800/80">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link
              href="/threads"
              className="group inline-flex items-center gap-2 text-fg hover:text-white transition-colors"
              aria-label="Back to threads"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5 text-fg-muted group-hover:text-fg" />
              <span className="font-display text-sm font-semibold tracking-tight">
                All Threads
              </span>
            </Link>
          </div>
        </nav>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Inbox className="w-10 h-10 text-fg-dim mb-3" />
          <h1 className="font-display text-lg font-bold text-fg mb-1">
            Storyline Not Found
          </h1>
          <p className="text-sm text-fg-muted mb-6 max-w-sm">
            We couldn&apos;t find any published chapters for this storyline.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/threads"
              className="inline-flex items-center px-4 py-2 rounded-lg border border-ink-800 bg-ink-900/60 text-xs font-medium text-fg hover:bg-ink-800 hover:text-white transition-colors"
            >
              View all threads
            </Link>
            <Link
              href="/feed"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-accent text-ink-950 text-xs font-semibold hover:bg-accent-bright transition-colors"
            >
              Open feed
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Determine thread title from storyLabel of clips
  const storyLabel = clips[0]?.storyLabel || storyKey.replace(/-/g, " ");

  return (
    <ClipFeed
      clips={clips}
      threadTitle={storyLabel}
      threadChapterCount={clips.length}
      backHref="/threads"
      backLabel="Threads"
    />
  );
}

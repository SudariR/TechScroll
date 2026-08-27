import React from "react";

export const ClipSkeleton = ({ title }: { title: string }) => (
  <div className="w-full max-w-md flex flex-col gap-4" aria-hidden="true">
    {/* progress row */}
    <div className="flex flex-col gap-2">
      <div className="h-[3px] w-full rounded-full bg-ink-800" />
      <div className="flex items-center justify-between text-[11px] text-fg-dim">
        <span className="font-semibold uppercase tracking-wider truncate pr-3 opacity-40">
          {title}
        </span>
      </div>
    </div>

    {/* stage — must match ClipPlayer's h-[420px] exactly */}
    <div className="w-full h-[420px] rounded-2xl border border-ink-800 bg-ink-900/40 animate-pulse" />

    {/* controls row */}
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-ink-900/60" />
      <div className="flex-1 h-10 rounded-xl bg-ink-900/60" />
      <div className="w-10 h-10 rounded-xl bg-ink-900/60" />
    </div>
  </div>
);

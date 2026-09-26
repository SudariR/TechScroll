"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImpactBadgeProps {
  score: number;
  scope?: string;
  horizon?: string;
  reasoning?: string;
}

export const ImpactBadge: React.FC<ImpactBadgeProps> = ({
  score,
  scope,
  horizon,
  reasoning,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Score bracket styling mapped to existing theme tokens
  const getColorStyles = () => {
    if (score >= 8) {
      return {
        badge: "bg-accent-soft border-accent-border text-accent",
        barActive: "bg-accent",
        barInactive: "bg-ink-800",
      };
    }
    if (score >= 5) {
      return {
        badge: "bg-accent-2-soft border-accent-2/30 text-accent-2",
        barActive: "bg-accent-2",
        barInactive: "bg-ink-800",
      };
    }
    return {
      badge: "bg-ink-900 border-ink-800 text-fg-dim",
      barActive: "bg-fg-dim",
      barInactive: "bg-ink-800",
    };
  };

  const colors = getColorStyles();
  const clampedScore = Math.max(1, Math.min(10, Math.round(score)));

  return (
    <div
      className="relative inline-block shrink-0"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
      role="button"
      tabIndex={0}
      aria-label={`Impact score ${score}/10`}
    >
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] tabular-nums font-semibold tracking-wider uppercase cursor-pointer select-none transition-colors ${colors.badge}`}
      >
        {/* Dot / bar meter (score/10) */}
        <span className="inline-flex items-center gap-0.5" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className={`w-0.5 h-2 rounded-full transition-colors ${
                i < clampedScore ? colors.barActive : colors.barInactive
              }`}
            />
          ))}
        </span>

        <span>{clampedScore}</span>

        {scope && (
          <span className="opacity-90">
            · {scope.toUpperCase()}
          </span>
        )}
      </div>

      {/* Popover / Tooltip with reasoning */}
      <AnimatePresence>
        {isOpen && reasoning && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-40 w-64 max-w-xs p-2.5 rounded-lg bg-ink-900 border border-ink-800 shadow-xl pointer-events-none text-left"
          >
            <div className="flex items-center justify-between text-[9px] uppercase tracking-wider font-bold mb-1">
              <span className={colors.badge.split(" ")[2] || "text-fg"}>
                Impact {clampedScore}/10 {scope ? `· ${scope}` : ""}
              </span>
              {horizon && (
                <span className="text-fg-dim font-normal">
                  Horizon: {horizon}
                </span>
              )}
            </div>
            <p className="text-[11px] text-fg-muted leading-relaxed font-normal normal-case">
              {reasoning}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

"use client";

import React from "react";
import { motion } from "framer-motion";
import { BridgeSceneData } from "../../../types/schema";
import { getIcon } from "../../../lib/iconRegistry";

interface Props {
  data: BridgeSceneData;
  isActive: boolean;
}

export const BridgeScene: React.FC<Props> = ({ data, isActive }) => {
  const Icon = getIcon(data.icon ?? "globe");

  return (
    <div className="relative w-full h-full flex flex-col justify-center p-7 bg-ink-950 text-fg rounded-2xl overflow-hidden">
      {/* Background ambient glow matching accent-3 (violet / time) */}
      <div className="absolute -top-20 -right-16 w-64 h-64 bg-accent-3-soft rounded-full blur-3xl pointer-events-none" />

      {/* Eyebrow: CHAPTER N · Story Label */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="z-10 inline-flex self-start items-center gap-2 mb-5 px-3 py-1 rounded-full bg-ink-900/80 border border-ink-800"
      >
        <Icon className="w-3.5 h-3.5 text-accent-3" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-accent-3">
          Chapter {data.chapterNumber}
        </span>
        <span className="text-ink-700">·</span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted truncate max-w-[220px]">
          {data.storyLabel}
        </span>
      </motion.div>

      {/* Two stacked blocks with connector */}
      <div className="relative z-10 flex flex-col gap-3">
        {/* Previously block */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
          className="relative p-4 rounded-xl bg-ink-900/60 border border-ink-800 backdrop-blur-sm"
        >
          <span className="block text-[10px] font-bold uppercase tracking-widest text-fg-dim mb-1">
            Previously
          </span>
          <p className="text-xs sm:text-sm text-fg-muted leading-relaxed">
            {data.previously}
          </p>
        </motion.div>

        {/* Vertical connector line */}
        <div className="relative h-6 flex items-center justify-center">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isActive ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
            className="w-[2px] h-full origin-top bg-gradient-to-b from-accent-3/70 to-accent-3"
          />
        </div>

        {/* What's new block */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.45, delay: 0.55, ease: "easeOut" }}
          className="relative p-4 rounded-xl bg-accent-3-soft border border-accent-3/30 backdrop-blur-sm"
        >
          <span className="block text-[10px] font-bold uppercase tracking-widest text-accent-3 mb-1">
            What&apos;s new
          </span>
          <p className="text-sm sm:text-[15px] text-fg font-medium leading-relaxed">
            {data.nowWhat}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

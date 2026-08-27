"use client";

import React from "react";
import { motion } from "framer-motion";
import { CauseEffectSceneData } from "../../../types/schema";
import { getIcon } from "../../../lib/iconRegistry";
import { ArrowDown } from "lucide-react";

interface Props {
  data: CauseEffectSceneData;
  isActive: boolean;
}

export const CauseEffectScene: React.FC<Props> = ({ data, isActive }) => {
  const Icon = getIcon(data.icon);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-7 bg-ink-950 text-fg rounded-2xl overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-accent-soft rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="z-10 inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-ink-900/80 border border-ink-800"
      >
        <Icon className="w-3.5 h-3.5 text-accent" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-fg-muted">
          {data.topic}
        </span>
      </motion.div>

      <div className="z-10 w-full max-w-sm flex flex-col items-center gap-3">
        {/* cause — muted, it's the setup */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="w-full p-4 rounded-2xl bg-ink-900/70 border border-ink-800"
        >
          <span className="block text-[10px] font-bold uppercase tracking-widest text-fg-dim mb-1.5">
            {data.causeLabel ?? "Cause"}
          </span>
          <p className="text-sm md:text-base text-fg-muted leading-relaxed">
            {data.cause}
          </p>
        </motion.div>

        {/* the causal link */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={
            isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }
          }
          transition={{
            duration: 0.35,
            delay: 0.5,
            type: "spring",
            stiffness: 240,
          }}
          className="grid place-items-center w-9 h-9 rounded-full bg-ink-950 border border-accent-border shadow-[0_0_20px_-4px_rgba(0,168,0,0.28)]"
        >
          <motion.div
            animate={isActive ? { y: [0, 3, 0] } : { y: 0 }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.9,
            }}
          >
            <ArrowDown className="w-4 h-4 text-accent" />
          </motion.div>
        </motion.div>

        {/* effect — bright, it's the payoff */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.65, ease: "easeOut" }}
          className="w-full p-4 rounded-2xl bg-accent-soft border border-accent-border
                     shadow-[0_0_35px_-12px_rgba(0,168,0,0.28)]"
        >
          <span className="block text-[10px] font-bold uppercase tracking-widest text-accent mb-1.5">
            {data.effectLabel ?? "Effect"}
          </span>
          <p className="text-sm md:text-base text-fg font-medium leading-relaxed">
            {data.effect}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

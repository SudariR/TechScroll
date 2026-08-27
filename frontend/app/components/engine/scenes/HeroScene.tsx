// src/components/engine/scenes/HeroScene.tsx
import React from "react";
import { motion } from "framer-motion";
import { HeroSceneData } from "../../../types/schema";
import { getIcon } from "../../../lib/iconRegistry";

interface Props {
  data: HeroSceneData;
  isActive: boolean;
}

export const HeroScene: React.FC<Props> = ({ data, isActive }) => {
  const Icon = getIcon(data.icon);
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8 bg-ink-950 text-fg rounded-2xl overflow-hidden">
      {/* 1. AMBIENT BACKGROUND GLOW (Subtle blue light blob in background) */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-accent-soft rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-accent-soft rounded-full blur-3xl pointer-events-none" />

      {/* 2. OPTIONAL COVER IMAGE / BRAND LOGO BADGE */}
      {data.imageUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-accent to-accent-bright rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
          <img
            src={data.imageUrl}
            alt={data.title}
            className="relative w-20 h-20 md:w-24 md:h-24 object-cover rounded-2xl border border-ink-700 shadow-2xl"
          />
        </motion.div>
      )}

      {/* 3. CATEGORY TAG WITH ICON */}
      {data.tag && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 mb-5 text-xs font-semibold tracking-wider uppercase bg-accent-soft text-accent rounded-full border border-accent-border"
        >
          <Icon className="w-3 h-3 text-accent" />
          <span>{data.tag}</span>
        </motion.div>
      )}

      {/* 4. MAIN TITLE */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl md:text-4xl font-display font-extrabold tracking-tight mb-3 leading-snug max-w-xl z-10"
      >
        {data.title}
      </motion.h1>

      {/* 5. SUBTITLE */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-sm md:text-base text-fg-muted max-w-md font-normal leading-relaxed z-10"
      >
        {data.subtitle}
      </motion.p>
    </div>
  );
};

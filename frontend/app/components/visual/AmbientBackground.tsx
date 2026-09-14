"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface AmbientBackgroundProps {
  variant?: "landing" | "feed";
}

const NOISE_SVG_DATA_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  variant = "landing",
}) => {
  const shouldReduceMotion = useReducedMotion();
  const isFeed = variant === "feed";

  // Feed mode has reduced opacity and slower pacing
  const opacities = isFeed
    ? {
        lime: 0.05,
        cyan: 0.04,
        violet: 0.04,
      }
    : {
        lime: 0.1,
        cyan: 0.08,
        violet: 0.08,
      };

  const durations = isFeed
    ? {
        blobA: 32,
        blobB: 38,
        blobC: 44,
      }
    : {
        blobA: 20,
        blobB: 24,
        blobC: 28,
      };

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* 1. Base Layer */}
      <div className="absolute inset-0 bg-ink-950" />

      {/* 2. Grid Layer with Radial Mask */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />

      {/* 3. Blurred Colour Blobs */}
      {/* Blob A: Lime / Primary Accent */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[520px] h-[520px] rounded-full blur-[100px]"
        style={{
          backgroundColor: "var(--color-accent)",
          opacity: opacities.lime,
        }}
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={
          shouldReduceMotion
            ? { x: 0, y: 0, scale: 1 }
            : {
                x: [-120, 100, -80, -120],
                y: [-60, 90, -70, -60],
                scale: [1, 1.15, 0.9, 1],
              }
        }
        transition={{
          duration: durations.blobA,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* Blob B: Cyan / Accent 2 */}
      <motion.div
        className="absolute top-1/2 right-1/4 w-[460px] h-[460px] rounded-full blur-[100px]"
        style={{
          backgroundColor: "var(--color-accent-2)",
          opacity: opacities.cyan,
        }}
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={
          shouldReduceMotion
            ? { x: 0, y: 0, scale: 1 }
            : {
                x: [80, -110, 60, 80],
                y: [-80, 100, -50, -80],
                scale: [0.95, 1.1, 0.85, 0.95],
              }
        }
        transition={{
          duration: durations.blobB,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* Blob C: Violet / Accent 3 */}
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{
          backgroundColor: "var(--color-accent-3)",
          opacity: opacities.violet,
        }}
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={
          shouldReduceMotion
            ? { x: 0, y: 0, scale: 1 }
            : {
                x: [-90, 80, -100, -90],
                y: [70, -90, 60, 70],
                scale: [1.05, 0.9, 1.12, 1.05],
              }
        }
        transition={{
          duration: durations.blobC,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* 4. Subtle Grain/Noise Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: NOISE_SVG_DATA_URI,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
};

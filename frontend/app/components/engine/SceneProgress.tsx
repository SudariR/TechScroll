import React from "react";
import { motion } from "framer-motion";

interface Props {
  total: number;
  currentIndex: number;
  duration: number; // seconds for the active segment
  isPlaying: boolean;
}

export const SceneProgress: React.FC<Props> = ({
  total,
  currentIndex,
  duration,
  isPlaying,
}) => {
  return (
    <div className="flex items-center gap-1.5 w-full">
      {Array.from({ length: total }).map((_, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div
            key={i}
            className="flex-1 h-[4px] rounded-full bg-ink-800/80 overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-accent-2 rounded-full origin-left shadow-[0_0_8px_rgba(0,168,0,0.5)]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isDone ? 1 : isCurrent && isPlaying ? 1 : 0 }}
              transition={
                isCurrent && isPlaying
                  ? { duration, ease: "linear" }
                  : { duration: 0.2 }
              }
            />
          </div>
        );
      })}
    </div>
  );
};

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
            className="flex-1 h-[3px] rounded-full bg-slate-700/60 overflow-hidden"
          >
            <motion.div
              className="h-full bg-blue-400 rounded-full origin-left"
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

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const ScrollHint = ({ show }: { show: boolean }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                   flex flex-col items-center gap-1"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-fg-dim">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-accent" />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

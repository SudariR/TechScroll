"use client";

import React from "react";
import { motion } from "framer-motion";
import { TimelineSceneData } from "../../../types/schema";
import { getIcon } from "../../../lib/iconRegistry";

interface Props {
  data: TimelineSceneData;
  isActive: boolean;
}

export const TimelineScene: React.FC<Props> = ({ data, isActive }) => {
  const Icon = getIcon(data.icon);
  const steps = data.steps.slice(0, 4); // hard cap — protects layout from bad AI output

  return (
    <div className="relative w-full h-full flex flex-col justify-center p-7 bg-slate-950 text-white rounded-2xl overflow-hidden">
      <div className="absolute -top-20 -right-16 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="z-10 inline-flex self-start items-center gap-2 mb-7 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800"
      >
        <Icon className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-300">
          {data.topic}
        </span>
      </motion.div>

      <div className="relative z-10 pl-1">
        {/* the spine — draws downward as the scene opens */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isActive ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="absolute left-[7px] top-2 bottom-2 w-[2px] origin-top
                     bg-gradient-to-b from-blue-500 via-blue-500/50 to-transparent"
        />

        <div className="flex flex-col gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -14 }}
              animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }}
              transition={{
                duration: 0.45,
                delay: 0.35 + i * 0.18,
                ease: "easeOut",
              }}
              className="relative flex gap-4"
            >
              {/* node */}
              <div className="relative shrink-0 mt-1">
                <div className="w-4 h-4 rounded-full bg-slate-950 border-2 border-blue-500" />
                {i === steps.length - 1 && (
                  <div className="absolute inset-0 rounded-full bg-blue-500/40 blur-md" />
                )}
              </div>

              <div className="pb-0.5">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">
                  {step.label}
                </span>
                <p className="text-sm md:text-[15px] text-slate-200 leading-relaxed">
                  {step.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

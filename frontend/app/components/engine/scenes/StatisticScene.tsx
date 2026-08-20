// src/components/engine/scenes/StatisticScene.tsx
import React from "react";
import { motion } from "framer-motion";
import { StatisticSceneData } from "../../../types/schema";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface Props {
  data: StatisticSceneData;
  isActive: boolean;
}

export const StatisticScene: React.FC<Props> = ({ data, isActive }) => {
  const getIcon = () => {
    if (data.trend === "up")
      return <TrendingUp className="w-6 h-6 text-emerald-400" />;
    if (data.trend === "down")
      return <TrendingDown className="w-6 h-6 text-rose-400" />;
    return <Activity className="w-6 h-6 text-blue-400" />;
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 bg-slate-950 text-white rounded-2xl text-center overflow-hidden">
      {/* Ambient Pulsing Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Label with Icon */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold uppercase tracking-widest text-slate-300 mb-6 z-10"
      >
        {getIcon()}
        <span>{data.label}</span>
      </motion.div>

      {/* Massive Glowing Number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.15,
          type: "spring",
          stiffness: 120,
        }}
        className="text-6xl md:text-8xl font-black tracking-tight mb-6 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(59,130,246,0.3)] z-10"
      >
        {data.value}
      </motion.div>

      {/* Context Description */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-base md:text-lg text-slate-300 max-w-md leading-relaxed z-10"
      >
        {data.context}
      </motion.p>
    </div>
  );
};

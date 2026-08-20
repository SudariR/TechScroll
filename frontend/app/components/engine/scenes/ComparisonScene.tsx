import React from "react";
import { motion } from "framer-motion";
import { ComparisonSceneData } from "../../../types/schema";
import { getBrandLogo } from "../../../lib/brandLogo";
import { getIcon } from "../../../lib/iconRegistry";

interface Props {
  data: ComparisonSceneData;
  isActive: boolean;
}

interface CardProps {
  label: string;
  value: string;
  domain?: string;
  highlighted: boolean;
  fromX: number;
  delay: number;
  isActive: boolean;
}

const CompareCard: React.FC<CardProps> = ({
  label,
  value,
  domain,
  highlighted,
  fromX,
  delay,
  isActive,
}) => {
  const logo = getBrandLogo(domain);

  return (
    <motion.div
      initial={{ opacity: 0, x: fromX }}
      animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: fromX }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`relative flex flex-col items-center text-center gap-3 p-5 rounded-2xl border transition-colors
        ${
          highlighted
            ? "bg-blue-950/40 border-blue-500/50 shadow-[0_0_35px_-10px_rgba(59,130,246,0.6)]"
            : "bg-slate-900/70 border-slate-800"
        }`}
    >
      {logo && (
        <div
          className={`w-11 h-11 rounded-xl grid place-items-center border
          ${highlighted ? "bg-slate-950 border-blue-500/30" : "bg-slate-950 border-slate-800"}`}
        >
          <img
            src={logo}
            alt={label}
            className="w-6 h-6 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      <span
        className={`text-[10px] font-bold uppercase tracking-widest
        ${highlighted ? "text-blue-400" : "text-slate-500"}`}
      >
        {label}
      </span>

      <p
        className={`text-lg md:text-2xl font-bold leading-tight
        ${highlighted ? "text-white" : "text-slate-300"}`}
      >
        {value}
      </p>
    </motion.div>
  );
};

export const ComparisonScene: React.FC<Props> = ({ data, isActive }) => {
  const emphasis = data.emphasis ?? "right";
  const Icon = getIcon(data.icon);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-slate-950 text-white rounded-2xl overflow-hidden">
      {/* ambient depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-700/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="z-10 inline-flex items-center gap-2 mb-7 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800"
      >
        <Icon className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-300">
          {data.topic}
        </span>
      </motion.div>

      <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-2xl items-stretch">
        <CompareCard
          label={data.leftLabel}
          value={data.leftValue}
          domain={data.leftDomain}
          highlighted={emphasis === "left"}
          fromX={-30}
          delay={0.15}
          isActive={isActive}
        />
        <CompareCard
          label={data.rightLabel}
          value={data.rightValue}
          domain={data.rightDomain}
          highlighted={emphasis === "right"}
          fromX={30}
          delay={0.28}
          isActive={isActive}
        />

        {/* center VS pivot */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
          }
          transition={{
            duration: 0.4,
            delay: 0.45,
            type: "spring",
            stiffness: 220,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     w-10 h-10 rounded-full grid place-items-center
                     bg-slate-950 border border-slate-700 shadow-xl"
        >
          <span className="text-[10px] font-black tracking-wider text-slate-400">
            VS
          </span>
        </motion.div>
      </div>
    </div>
  );
};

import {
  Cpu,
  Shield,
  Zap,
  TrendingUp,
  Database,
  Cloud,
  Lock,
  Bug,
  Rocket,
  Globe,
  Code,
  Brain,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// The ONLY icons the AI is allowed to reference.
export const ICON_REGISTRY: Record<string, LucideIcon> = {
  cpu: Cpu,
  shield: Shield,
  zap: Zap,
  "trending-up": TrendingUp,
  database: Database,
  cloud: Cloud,
  lock: Lock,
  bug: Bug,
  rocket: Rocket,
  globe: Globe,
  code: Code,
  brain: Brain,
};

export type IconName = keyof typeof ICON_REGISTRY;

// Safe accessor — never crashes on a bad AI value.
export const getIcon = (name?: string): LucideIcon =>
  (name && ICON_REGISTRY[name]) || Sparkles;

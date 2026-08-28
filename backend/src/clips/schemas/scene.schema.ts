import { z } from 'zod';

/* ------------------------------------------------------------------ */
/* Shared constraints                                                  */
/* ------------------------------------------------------------------ */

export const ICON_NAMES = [
  'cpu', 'shield', 'zap', 'trending-up', 'database', 'cloud',
  'lock', 'bug', 'rocket', 'globe', 'code', 'brain',
] as const;

const iconSchema = z.enum(ICON_NAMES).optional();

const baseFields = {
  id: z.string().min(1),
  icon: iconSchema,
  duration: z.number().int().min(3).max(12).optional(),
};

/* domains like "nvidia.com" — never full URLs */
const domainSchema = z
  .string()
  .regex(/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i, 'must be a bare domain, e.g. nvidia.com')
  .optional();

/* ------------------------------------------------------------------ */
/* Scene templates                                                     */
/* ------------------------------------------------------------------ */

export const heroSceneSchema = z.object({
  ...baseFields,
  template: z.literal('Hero'),
  tag: z.string().max(24).optional(),
  title: z.string().min(3).max(48),
  subtitle: z.string().min(10).max(160),
});

export const comparisonSceneSchema = z.object({
  ...baseFields,
  template: z.literal('Comparison'),
  topic: z.string().min(3).max(40),
  leftLabel: z.string().min(2).max(28),
  leftValue: z.string().min(2).max(48),
  rightLabel: z.string().min(2).max(28),
  rightValue: z.string().min(2).max(48),
  leftDomain: domainSchema,
  rightDomain: domainSchema,
  emphasis: z.enum(['left', 'right', 'none']).catch('right').optional(),
});

export const statisticSceneSchema = z.object({
  ...baseFields,
  template: z.literal('Statistic'),
  label: z.string().min(3).max(32),
  value: z.string().min(1).max(12),
  context: z.string().min(10).max(140),
  trend: z.enum(['up', 'down', 'neutral']).optional(),
});

export const timelineStepSchema = z.object({
  label: z.string().min(1).max(28),
  text: z.string().min(10).max(100),
});

export const timelineSceneSchema = z.object({
  ...baseFields,
  template: z.literal('Timeline'),
  topic: z.string().min(3).max(40),
  steps: z.array(timelineStepSchema).min(2).max(4),
});

export const causeEffectSceneSchema = z.object({
  ...baseFields,
  template: z.literal('CauseEffect'),
  topic: z.string().min(3).max(40),
  cause: z.string().min(10).max(160),
  effect: z.string().min(10).max(160),
  causeLabel: z.string().max(28).optional(),
  effectLabel: z.string().max(28).optional(),
});

/* ------------------------------------------------------------------ */
/* The union                                                           */
/* ------------------------------------------------------------------ */

export const sceneSchema = z.discriminatedUnion('template', [
  heroSceneSchema,
  comparisonSceneSchema,
  statisticSceneSchema,
  timelineSceneSchema,
  causeEffectSceneSchema,
]);

export type Scene = z.infer<typeof sceneSchema>;
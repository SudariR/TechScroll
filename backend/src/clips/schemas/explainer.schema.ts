import { z } from 'zod';
import { sceneSchema } from './scene.schema';

export const CATEGORIES = [
  'AI', 'PROGRAMMING', 'CYBERSECURITY', 'STARTUPS',
  'CLOUD', 'HARDWARE', 'MOBILE', 'OPEN_SOURCE',
] as const;

export const explainerSchema = z
  .object({
    title: z.string().min(5).max(60),
    hook: z.string().min(20).max(140),
    takeaway: z.string().min(20).max(160),
    category: z.enum(CATEGORIES),
    impact: z.object({
      score: z.number().int().min(1).max(10),
      scope: z.enum(['individual', 'industry', 'global']),
      horizon: z.enum(['now', 'months', 'years']),
      reasoning: z.string().min(20).max(160),
    }),
    story: z.object({
      key: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).min(6).max(48),
      label: z.string().min(4).max(40),
      entities: z.array(z.string().min(2).max(32)).min(1).max(5),
    }),
    scenes: z.array(sceneSchema).min(3).max(6),
  })
  .superRefine((clip, ctx) => {
    /* scene ids must be unique — duplicate React keys are a silent killer */
    const ids = clip.scenes.map((s) => s.id);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['scenes'],
        message: 'scene ids must be unique',
      });
    }

    /* every clip must open with a Hero */
    if (clip.scenes[0]?.template !== 'Hero') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['scenes', 0],
        message: 'the first scene must use the Hero template',
      });
    }

    /* and land on impact, not a raw number */
    const last = clip.scenes[clip.scenes.length - 1]?.template;
    if (last !== 'CauseEffect' && last !== 'Statistic') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['scenes', clip.scenes.length - 1],
        message: 'the final scene must be CauseEffect or Statistic',
      });
    }
  });

export type Explainer = z.infer<typeof explainerSchema>;
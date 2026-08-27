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
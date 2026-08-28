import type { Explainer } from '../../clips/schemas/explainer.schema';

export interface QualityWarning {
  code: string;
  detail: string;
}

const HYPE_WORDS = [
  'revolutionary', 'game-changing', 'game changing', 'groundbreaking',
  'cutting-edge', 'unprecedented', 'seamless', 'robust', 'leverage',
  'disrupt', 'supercharge', 'unlock', 'transformative', 'next-level',
];

/** Approximate reading speed used to sanity-check durations. */
const WORDS_PER_SECOND = 5;

function sceneText(scene: any): string {
  return Object.entries(scene)
    .filter(([k]) => !['id', 'template', 'icon', 'duration'].includes(k))
    .map(([, v]) =>
      Array.isArray(v)
        ? v.map((s: any) => `${s.label} ${s.text}`).join(' ')
        : String(v ?? ''),
    )
    .join(' ');
}

export function runQualityChecks(clip: Explainer): QualityWarning[] {
  const warnings: QualityWarning[] = [];
  const push = (code: string, detail: string) => warnings.push({ code, detail });

  /* --- structure --- */

  const templates = clip.scenes.map((s) => s.template);

  for (let i = 1; i < templates.length; i++) {
    if (templates[i] === templates[i - 1]) {
      push('ADJACENT_DUPLICATE_TEMPLATE', `${templates[i]} repeats at scene ${i + 1}`);
    }
  }

  if (new Set(templates).size < 3) {
    push('LOW_TEMPLATE_VARIETY', `only ${new Set(templates).size} distinct templates used`);
  }

  if (clip.scenes.length < 4 || clip.scenes.length > 5) {
    push('SCENE_COUNT_OUTSIDE_TARGET', `${clip.scenes.length} scenes (target 4-5)`);
  }

  /* --- icons --- */

  clip.scenes.forEach((s, i) => {
    if (!s.icon) push('MISSING_ICON', `scene ${i + 1} (${s.template}) has no icon`);
  });

  /* --- durations --- */

  clip.scenes.forEach((s, i) => {
    const words = sceneText(s).split(/\s+/).filter(Boolean).length;
    const expected = Math.max(5, Math.round(words / WORDS_PER_SECOND));
    const actual = s.duration ?? 0;

    if (!s.duration) {
      push('MISSING_DURATION', `scene ${i + 1} has no duration`);
    } else if (Math.abs(actual - expected) > 3) {
      push(
        'DURATION_MISMATCH',
        `scene ${i + 1}: ${actual}s for ${words} words (expected ~${expected}s)`,
      );
    }
  });

  /* --- language --- */

  const allText = [
    clip.title, clip.hook, clip.takeaway,
    ...clip.scenes.map(sceneText),
  ].join(' ').toLowerCase();

  HYPE_WORDS.forEach((word) => {
    if (allText.includes(word)) push('HYPE_LANGUAGE', `contains "${word}"`);
  });

  /* --- redundancy --- */

  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  if (norm(clip.hook) === norm(clip.takeaway)) {
    push('HOOK_EQUALS_TAKEAWAY', 'hook and takeaway are identical');
  }

  const hero = clip.scenes[0];
  if (hero.template === 'Hero' && norm(hero.title) === norm(clip.title)) {
    push('HERO_DUPLICATES_TITLE', 'hero title repeats the clip title verbatim');
  }

  /* --- statistic sanity --- */

  clip.scenes.forEach((s, i) => {
    if (s.template === 'Statistic' && !/\d/.test(s.value)) {
      push('STATISTIC_WITHOUT_NUMBER', `scene ${i + 1} value "${s.value}" has no digit`);
    }
  });

  /* --- near-truncation risk --- */

  const LIMITS: Record<string, number> = {
    title: 48, subtitle: 160, leftValue: 48, rightValue: 48,
    context: 140, cause: 160, effect: 160,
  };

  clip.scenes.forEach((s, i) => {
    Object.entries(LIMITS).forEach(([field, max]) => {
      const val = (s as any)[field];
      if (typeof val === 'string' && val.length > max * 0.92) {
        push(
          'NEAR_LIMIT',
          `scene ${i + 1} ${field} is ${val.length}/${max} chars — layout risk`,
        );
      }
    });
  });

  return warnings;
}
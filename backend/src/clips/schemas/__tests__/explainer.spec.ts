import { validateExplainer, ExplainerValidationError } from '../validate-explainer';

const valid = {
  title: 'Why NVIDIA Just Made History',
  hook: 'NVIDIA just overtook Microsoft to become the most valuable company on Earth.',
  takeaway: 'AI infrastructure is now reshaping global market dominance.',
  category: 'HARDWARE',
  impact: {
    score: 8,
    scope: 'global' as const,
    horizon: 'years' as const,
    reasoning: "NVIDIA's dominance in AI compute concentrates architectural control of the AI ecosystem.",
  },
  story: {
    key: 'nvidia-ai-dominance',
    label: 'NVIDIA AI Dominance',
    entities: ['NVIDIA', 'Microsoft'],
  },
  scenes: [
    {
      id: 'c1-s1', template: 'Hero', icon: 'cpu', tag: 'AI Hardware',
      title: 'NVIDIA Becomes #1',
      subtitle: 'For the first time, a chipmaker is worth more than Microsoft.',
      duration: 5,
    },
    {
      id: 'c1-s2', template: 'Timeline', icon: 'rocket', topic: 'How NVIDIA Got Here',
      steps: [
        { label: '1999', text: 'Invents the GPU for video games.' },
        { label: '2023', text: 'The AI boom makes its chips the industry bottleneck.' },
      ],
      duration: 7,
    },
    {
      id: 'c1-s3', template: 'CauseEffect', icon: 'brain', topic: 'Why It Matters',
      cause: 'Every major AI model is trained on NVIDIA hardware.',
      effect: 'The pace of AI progress now depends on a single chipmaker.',
      duration: 7,
    },
  ],
};

describe('explainer validation', () => {
  it('accepts a well-formed clip', () => {
    expect(() => validateExplainer(valid)).not.toThrow();
  });

  it('accepts a well-formed clip with a Bridge scene at index 1', () => {
    const withBridge = {
      ...valid,
      scenes: [
        valid.scenes[0],
        {
          id: 'bridge',
          template: 'Bridge',
          icon: 'globe',
          storyLabel: 'NVIDIA AI Dominance',
          previously: 'NVIDIA led the datacenter GPU market across 2023.',
          nowWhat: 'New Blackwell architecture extends its lead across enterprise clusters.',
          chapterNumber: 2,
          duration: 7,
        },
        valid.scenes[1],
        valid.scenes[2],
      ],
    };
    expect(() => validateExplainer(withBridge)).not.toThrow();
  });

  it('rejects an invalid story key with uppercase or special characters', () => {
    const bad = structuredClone(valid);
    bad.story.key = 'NVIDIA_AI_Dominance';
    expect(() => validateExplainer(bad)).toThrow();
  });

  it('rejects an unknown icon', () => {
    const bad = structuredClone(valid);
    (bad.scenes[0] as any).icon = 'microchip';
    expect(() => validateExplainer(bad)).toThrow(ExplainerValidationError);
  });

  it('rejects overlong comparison values', () => {
    const bad = structuredClone(valid);
    bad.scenes[1] = {
      id: 'x', template: 'Comparison', topic: 'Test',
      leftLabel: 'A', leftValue: 'x'.repeat(200),
      rightLabel: 'B', rightValue: 'y',
    } as any;
    expect(() => validateExplainer(bad)).toThrow();
  });

  it('rejects duplicate scene ids', () => {
    const bad = structuredClone(valid);
    bad.scenes[1].id = 'c1-s1';
    expect(() => validateExplainer(bad)).toThrow(/unique/);
  });

  it('rejects a clip that does not open with Hero', () => {
    const bad = structuredClone(valid);
    bad.scenes = [bad.scenes[1], bad.scenes[0], bad.scenes[2]] as any;
    expect(() => validateExplainer(bad)).toThrow(/Hero/);
  });

  it('rejects an invalid impact score outside 1-10', () => {
    const bad = structuredClone(valid);
    (bad.impact as any).score = 11;
    expect(() => validateExplainer(bad)).toThrow();
  });

  it('rejects invalid impact scope or horizon', () => {
    const bad = structuredClone(valid);
    (bad.impact as any).scope = 'unknown';
    expect(() => validateExplainer(bad)).toThrow();
  });
});

import { runQualityChecks } from '../../../ai/quality-checks';

describe('quality checks', () => {
  it('flags IMPACT_REASONING_WEAK when reasoning is under 40 characters', () => {
    const clip = {
      ...valid,
      impact: {
        score: 8,
        scope: 'global' as const,
        horizon: 'years' as const,
        reasoning: 'Too short reasoning.',
      },
    };
    const warnings = runQualityChecks(clip as any);
    expect(warnings.some((w) => w.code === 'IMPACT_REASONING_WEAK')).toBe(true);
  });

  it('flags IMPACT_REASONING_WEAK when reasoning overlaps heavily with title', () => {
    const clip = {
      ...valid,
      title: 'OpenAI Releases New Frontier Model GPT Five',
      impact: {
        score: 8,
        scope: 'global' as const,
        horizon: 'years' as const,
        reasoning: 'OpenAI releases new frontier model for developers worldwide today.',
      },
    };
    const warnings = runQualityChecks(clip as any);
    expect(warnings.some((w) => w.code === 'IMPACT_REASONING_WEAK')).toBe(true);
  });
});
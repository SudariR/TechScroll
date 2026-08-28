import { validateExplainer, ExplainerValidationError } from '../validate-explainer';

const valid = {
  title: 'Why NVIDIA Just Made History',
  hook: 'NVIDIA just overtook Microsoft to become the most valuable company on Earth.',
  takeaway: 'AI infrastructure is now reshaping global market dominance.',
  category: 'HARDWARE',
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
});
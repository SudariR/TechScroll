// src/data/mockExplainer.ts
import { ExplainerClip } from '../types/schema';

export const MOCK_NVIDIA_EXPLAINER: ExplainerClip = {
  id: 'clip-001',
  title: 'Why NVIDIA Just Made History',
  hook: 'NVIDIA just overtook Microsoft to become the most valuable company on Earth.',
  takeaway: 'AI infrastructure is now reshaping global market dominance.',
  scenes: [
    {
      id: 'scene-1',
      template: 'Hero',
      tag: 'AI Hardware',
      title: 'NVIDIA Becomes #1',
      subtitle: 'For the first time in history, a chipmaker is worth more than Microsoft and Apple.',
      // 👇 Real NVIDIA Logo thumbnail!
      imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nvidia/nvidia-original.svg',
      duration: 5,
      icon: 'cpu', // 👈 NEW: Icon for the scene (from our icon registr)
    },
    {
      id: 'scene-2',
      template: 'Comparison',
      icon: 'trending-up',
      topic: 'Market Cap Shift',
      leftLabel: 'NVIDIA in 2020',
      leftValue: '$100 Billion',
      leftDomain: 'nvidia.com',
      rightLabel: 'NVIDIA Today',
      rightValue: '$3.3+ Trillion',
      rightDomain: 'nvidia.com',
      emphasis: 'right',
      duration: 6,
},

      {
      id: 'scene-timeline',
      template: 'Timeline',
      icon: 'rocket',
      topic: 'How NVIDIA Got Here',
      steps: [
        { label: '1999', text: 'Invents the GPU for video games.' },
        { label: '2012', text: 'Researchers discover GPUs train neural networks far faster than CPUs.' },
        { label: '2023', text: 'The generative AI boom makes NVIDIA chips the bottleneck of the entire industry.' },
      ],
      duration: 7,
      },
    {
      id: 'scene-3',
      template: 'Statistic',
      label: 'AI Data Center Demand',
      value: '+427%',
      context: 'Year-over-year revenue growth driven by AI data center GPUs.',
      trend: 'up', // 👈 Shows the glowing green upwards trend arrow!
      duration: 5,
    },
        {
      id: 'scene-why',
      template: 'CauseEffect',
      icon: 'brain',
      topic: 'Why It Matters To You',
      causeLabel: 'What happened',
      cause: 'Every major AI model is trained on NVIDIA hardware, giving one company control of the supply.',
      effectLabel: 'What it means',
      effect: 'The pace of AI progress — and its cost — now depends on a single chipmaker.',
      duration: 7,
    },
  ],
};
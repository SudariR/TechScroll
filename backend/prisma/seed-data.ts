/** Minimal shape for seeding. The authoritative contract lives in
 *  src/clips/schemas/ — this is deliberately loose since scenes are
 *  stored as a JSON column. */
interface SeedClip {
  id: string;
  title: string;
  hook: string;
  takeaway: string;
  category:
    | 'AI' | 'PROGRAMMING' | 'CYBERSECURITY' | 'STARTUPS'
    | 'CLOUD' | 'HARDWARE' | 'MOBILE' | 'OPEN_SOURCE';
  scenes: Record<string, unknown>[];
}

/* ------------------------------------------------------------------ */
/* CLIP 1 — AI Hardware                                                */
/* ------------------------------------------------------------------ */
export const MOCK_NVIDIA_EXPLAINER: SeedClip = {
  id: 'clip-001',
  title: 'Why NVIDIA Just Made History',
  hook: 'NVIDIA just overtook Microsoft to become the most valuable company on Earth.',
  takeaway: 'AI infrastructure is now reshaping global market dominance.',
  category: 'HARDWARE',
  scenes: [
    {
      id: 'c1-s1',
      template: 'Hero',
      icon: 'cpu',
      tag: 'AI Hardware',
      title: 'NVIDIA Becomes #1',
      subtitle:
        'For the first time in history, a chipmaker is worth more than Microsoft and Apple.',
      duration: 5,
      
    },
    {
      id: 'c1-s2',
      template: 'Timeline',
      icon: 'rocket',
      topic: 'How NVIDIA Got Here',
      steps: [
        { label: '1999', text: 'Invents the GPU for video games.' },
        {
          label: '2012',
          text: 'Researchers discover GPUs train neural networks far faster than CPUs.',
        },
        {
          label: '2023',
          text: 'The generative AI boom makes NVIDIA chips the bottleneck of the entire industry.',
        },
      ],
      duration: 7,
    },
    {
      id: 'c1-s3',
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
      id: 'c1-s4',
      template: 'Statistic',
      icon: 'trending-up',
      label: 'AI Data Center Demand',
      value: '+427%',
      context: 'Year-over-year revenue growth driven by AI data center GPUs.',
      trend: 'up',
      duration: 5,
    },
    {
      id: 'c1-s5',
      template: 'CauseEffect',
      icon: 'brain',
      topic: 'Why It Matters To You',
      causeLabel: 'What happened',
      cause:
        'Every major AI model is trained on NVIDIA hardware, giving one company control of the supply.',
      effectLabel: 'What it means',
      effect:
        'The pace of AI progress — and its cost — now depends on a single chipmaker.',
      duration: 7,
    },
  ],
};

/* ------------------------------------------------------------------ */
/* CLIP 2 — Cybersecurity                                              */
/* ------------------------------------------------------------------ */
export const MOCK_SECURITY_EXPLAINER: SeedClip = {
  id: 'clip-002',
  title: 'The Supply Chain Attack Nobody Noticed',
  hook: 'A single compromised npm package can reach millions of apps overnight.',
  takeaway:
    'Modern software is assembled, not written — so trust is the real attack surface.',
    category: 'CYBERSECURITY',
  scenes: [
    {
      id: 'c2-s1',
      template: 'Hero',
      icon: 'bug',
      tag: 'Cybersecurity',
      title: 'One Package, Millions of Victims',
      subtitle:
        'Attackers no longer break into apps. They break into the libraries those apps depend on.',
      duration: 5,
      
    },
    {
      id: 'c2-s2',
      template: 'CauseEffect',
      icon: 'lock',
      topic: 'How The Attack Works',
      causeLabel: 'The entry point',
      cause:
        'A maintainer account is phished, and malicious code is published as a routine patch update.',
      effectLabel: 'The blast radius',
      effect:
        'Every project auto-updating that dependency ships the attacker’s code to its own users.',
      duration: 7,
    },
    {
      id: 'c2-s3',
      template: 'Statistic',
      icon: 'shield',
      label: 'Average Dependencies Per App',
      value: '1,000+',
      context:
        'A typical JavaScript project pulls in over a thousand indirect packages you never chose.',
      trend: 'up',
      duration: 6,
    },
    {
      id: 'c2-s4',
      template: 'Comparison',
      icon: 'shield',
      topic: 'Old Threat vs New Threat',
      leftLabel: 'Traditional Attack',
      leftValue: 'Break through the front door',
      rightLabel: 'Supply Chain Attack',
      rightValue: 'Arrive as a trusted update',
      emphasis: 'right',
      duration: 6,
    },
  ],
};

/* ------------------------------------------------------------------ */
/* CLIP 3 — Open Source                                                */
/* ------------------------------------------------------------------ */
export const MOCK_OPENSOURCE_EXPLAINER: SeedClip = {
  id: 'clip-003',
  title: 'When Open Source Stops Being Open',
  hook: 'A licence change can turn the tool your company runs on into a bill.',
  takeaway:
    'Open source is a legal agreement first and a community second — read the licence.',
  category: 'OPEN_SOURCE',
  scenes: [
    {
      id: 'c3-s1',
      template: 'Hero',
      icon: 'code',
      tag: 'Open Source',
      title: 'The Great Relicensing',
      subtitle:
        'Major infrastructure projects are abandoning permissive licences to stop cloud giants reselling their work.',
      duration: 5,
       
    },
    {
      id: 'c3-s2',
      template: 'Timeline',
      icon: 'globe',
      topic: 'A Familiar Pattern',
      steps: [
        { label: 'Stage 1', text: 'Project launches under a permissive open licence and grows fast.' },
        { label: 'Stage 2', text: 'Cloud providers offer it as a managed service and capture the revenue.' },
        { label: 'Stage 3', text: 'Maintainers relicense to a restrictive source-available model.' },
        { label: 'Stage 4', text: 'The community forks the last free version and splits in two.' },
      ],
      duration: 8,
    },
    {
      id: 'c3-s3',
      template: 'Comparison',
      icon: 'database',
      topic: 'Licence Models',
      leftLabel: 'Permissive (MIT / Apache)',
      leftValue: 'Use it anywhere, including commercially',
      rightLabel: 'Source-Available (BSL / SSPL)',
      rightValue: 'Readable, but restricted commercial use',
      emphasis: 'right',
      duration: 6,
    },
    {
      id: 'c3-s4',
      template: 'CauseEffect',
      icon: 'zap',
      topic: 'Why Developers Should Care',
      causeLabel: 'The change',
      cause:
        'A dependency you already ship silently moves to a restrictive licence in its next major version.',
      effectLabel: 'The consequence',
      effect:
        'Upgrading could put your product in breach of contract — or force you to pay for what was free.',
      duration: 7,
    },
  ],
};

/* ------------------------------------------------------------------ */
/* THE FEED                                                            */
/* ------------------------------------------------------------------ */
export const MOCK_FEED: SeedClip[] = [
  MOCK_NVIDIA_EXPLAINER,
  MOCK_SECURITY_EXPLAINER,
  MOCK_OPENSOURCE_EXPLAINER,
];
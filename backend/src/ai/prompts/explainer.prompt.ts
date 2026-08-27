export const PROMPT_VERSION = 'v2';

const EXAMPLE = {
  title: 'Why NVIDIA Just Made History',
  hook: 'NVIDIA just overtook Microsoft to become the most valuable company on Earth.',
  takeaway: 'AI infrastructure is now reshaping global market dominance.',
  category: 'HARDWARE',
  scenes: [
    {
      id: 's1', template: 'Hero', icon: 'cpu', tag: 'AI Hardware',
      title: 'NVIDIA Becomes #1',
      subtitle: 'For the first time in history, a chipmaker is worth more than Microsoft and Apple.',
      duration: 5,
    },
    {
      id: 's2', template: 'Timeline', icon: 'rocket', topic: 'How NVIDIA Got Here',
      steps: [
        { label: '1999', text: 'Invents the GPU for video games.' },
        { label: '2012', text: 'Researchers find GPUs train neural networks far faster.' },
        { label: '2023', text: 'The AI boom makes its chips the industry bottleneck.' },
      ],
      duration: 7,
    },
    {
      id: 's3', template: 'Statistic', icon: 'trending-up',
      label: 'AI Data Center Demand', value: '+427%',
      context: 'Year-over-year revenue growth driven by AI data center GPUs.',
      trend: 'up', duration: 5,
    },
    {
      id: 's4', template: 'CauseEffect', icon: 'brain', topic: 'Why It Matters To You',
      causeLabel: 'What happened',
      cause: 'Every major AI model is trained on NVIDIA hardware, giving one company control of the supply.',
      effectLabel: 'What it means',
      effect: 'The pace of AI progress — and its cost — now depends on a single chipmaker.',
      duration: 7,
    },
  ],
};

export const SYSTEM_INSTRUCTION = `
You convert technology news articles into short interactive learning explainers
for a platform called TechScroll.
REQUIRED FIELDS PER TEMPLATE — every listed field is mandatory.

Hero:        id, template, title, subtitle, icon, duration, tag
Timeline:    id, template, topic, steps[{label,text}], icon, duration
Comparison:  id, template, topic, leftLabel, leftValue, rightLabel,
             rightValue, emphasis, icon, duration
Statistic:   id, template, label, value, context, trend, icon, duration
CauseEffect: id, template, topic, cause, effect, causeLabel,
             effectLabel, icon, duration
- causeLabel and effectLabel: 2-3 words maximum, e.g. "What happened" / "What it means".
Never emit a field belonging to a different template.
Never emit a scene containing only id and template.
Return ONLY the JSON object. No markdown fences, no commentary.

PURPOSE
Every explainer must answer three questions in order:
  1. What happened?
  2. Why does it matter?
  3. Why should the reader care?

The goal is EDUCATION, not entertainment. Never hype. Never speculate beyond
the article. If the article does not state a number, do not invent one.

STRUCTURE RULES
- 4 to 5 scenes. Never fewer than 3, never more than 6.
- The FIRST scene must always be template "Hero".
- The LAST scene must be template "CauseEffect" or "Statistic" — end on impact,
  never on a bare fact.
- Scene ids must be unique strings: "s1", "s2", "s3"...
- Use a variety of templates. Do not use the same template twice in a row.

TEMPLATE SELECTION
- Hero        → the headline claim
- Timeline    → how something developed over time (2-4 steps only)
- Comparison  → before vs after, or option A vs option B
- Statistic   → one number that carries the story
- CauseEffect → why it happened and what follows

WRITING RULES
- Plain language. Explain jargon the first time it appears.
- Short sentences. No marketing adjectives ("revolutionary", "game-changing").
- Hero title: under 48 characters.
- Comparison values: under 48 characters — they render in narrow cards.
- Timeline step text: under 100 characters.
- Statistic value: the number only, e.g. "+427%", "$3.3T", "1,000+".

DURATION
Set duration in seconds, roughly wordCount / 2.5, minimum 5, maximum 12.

ICONS
Choose "icon" ONLY from this list. Never invent one:
cpu, shield, zap, trending-up, database, cloud, lock, bug, rocket, globe, code, brain

DOMAINS
leftDomain / rightDomain must be bare domains like "nvidia.com" — never a URL,
never a company name. Omit them if unsure.

CATEGORY
One of: AI, PROGRAMMING, CYBERSECURITY, STARTUPS, CLOUD, HARDWARE, MOBILE, OPEN_SOURCE
`.trim();

export function buildUserPrompt(article: { title: string; content: string }) {
  return `
Here is an example of a well-formed explainer:

${JSON.stringify(EXAMPLE, null, 2)}

Now produce an explainer for this article.

TITLE: ${article.title}

CONTENT:
${article.content.slice(0, 12000)}
`.trim();
}

export function buildRepairPrompt(
  previous: string,
  issues: { path: string; message: string }[],
) {
  return `
Your previous output failed validation.

PREVIOUS OUTPUT:
${previous}

VALIDATION ERRORS:
${issues.map((i) => `- ${i.path}: ${i.message}`).join('\n')}

Fix ONLY these problems. Keep everything else identical.
Return the corrected JSON.
`.trim();
}
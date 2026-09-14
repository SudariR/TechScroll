export interface BridgePromptInput {
  storyLabel: string;
  chapterNumber: number;
  previousTakeaways: string[]; // newest last, max 3
  currentTitle: string;
  currentHook: string;
  currentTakeaway: string;
}

export function buildBridgePrompt(input: {
  storyLabel: string;
  chapterNumber: number;
  previousTakeaways: string[];
  currentTitle: string;
  currentHook: string;
  currentTakeaway: string;
}): string {
  const previousList = input.previousTakeaways
    .slice(-3)
    .map((t, idx) => `  ${idx + 1}. ${t}`)
    .join('\n');

  return `
You are generating a continuity bridge between chapters of an ongoing story for TechScroll.

STORY: "${input.storyLabel}"
CURRENT CHAPTER: Chapter ${input.chapterNumber}

PREVIOUS CHAPTER TAKEAWAYS (oldest to newest):
${previousList || '  (No prior takeaways provided)'}

CURRENT CHAPTER:
Headline: "${input.currentTitle}"
Hook: "${input.currentHook}"
Takeaway: "${input.currentTakeaway}"

TASK:
Produce a single JSON object with exactly two keys:
1. "previously": Summarises what a reader who saw earlier chapters already knows. Use past tense. Never repeat or quote the current headline.
2. "nowWhat": States specifically what is different now. It must name the concrete new development/change, not restate the ongoing story.

RULES:
- Plain language, direct, educational tone. No marketing or hype adjectives.
- "previously" must be between 20 and 180 characters.
- "nowWhat" must be between 20 and 180 characters.
- Return ONLY the JSON object. No markdown code fences, no extra text.

EXAMPLE OUTPUT:
{
  "previously": "The US restricted high-end GPU exports to China, prompting domestic chipmakers to develop custom architectures.",
  "nowWhat": "New enforcement rules close third-country cloud loopholes and lower compute density thresholds."
}
`.trim();
}

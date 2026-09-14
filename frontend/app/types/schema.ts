export type SceneTemplate =
  | 'Hero'
  | 'Comparison'
  | 'Statistic'
  | 'Timeline'
  | 'CauseEffect'
  | 'Bridge';

export interface BaseScene {
  id: string;
  template: SceneTemplate;
  duration?: number;
  icon?: string;
}

export interface HeroSceneData extends BaseScene {
  template: 'Hero';
  title: string;
  subtitle: string;
  tag?: string;
  imageUrl?: string; 
  logoUrl?: string;  
}

export interface ComparisonSceneData extends BaseScene {
  template: 'Comparison';
  topic: string;
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
  leftDomain?: string;   // e.g. "microsoft.com" — resolved by getBrandLogo()
  rightDomain?: string;  // e.g. "nvidia.com"
  emphasis?: 'left' | 'right' | 'none'; // which side is the "point"
}

export interface StatisticSceneData extends BaseScene {
  template: 'Statistic';
  label: string;
  value: string;
  context: string;
  trend?: 'up' | 'down' | 'neutral'; 
}

export interface TimelineStep {
  label: string;   // "Jan 2023" — the time marker
  text: string;    // what happened
}

export interface TimelineSceneData extends BaseScene {
  template: 'Timeline';
  topic: string;
  steps: TimelineStep[];   // keep to 3–4; more won't fit a phone screen
}

export interface CauseEffectSceneData extends BaseScene {
  template: 'CauseEffect';
  topic: string;
  cause: string;
  effect: string;
  causeLabel?: string;   // defaults: "Cause" / "Effect"
  effectLabel?: string;
}

export interface BridgeSceneData extends BaseScene {
  template: 'Bridge';
  storyLabel: string;
  previously: string;
  nowWhat: string;
  chapterNumber: number;
}

export type SceneData =
  | HeroSceneData
  | ComparisonSceneData
  | StatisticSceneData
  | TimelineSceneData
  | CauseEffectSceneData
  | BridgeSceneData;

export interface ExplainerClip {
  id: string;
  title: string;
  hook: string;
  takeaway: string;
  category?: string;
  publishedAt?: string;
  autoPublished?: boolean;
  impactScore?: number;
  impactScope?: string;
  impactHorizon?: string;
  impactReasoning?: string;
  storyKey?: string | null;
  storyLabel?: string | null;
  chapterNumber?: number;
  entities?: string[];
  bridgeScene?: BridgeSceneData | null;
  scenes: SceneData[];
}

export interface StoryThread {
  storyKey: string;
  storyLabel: string;
  chapterCount: number;
  latestPublishedAt: string;
  topImpactScore: number;
  entities: string[];
  latestTitle: string;
}
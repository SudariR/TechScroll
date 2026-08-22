export type SceneTemplate = 'Hero' | 'Comparison' | 'Statistic'| 'Timeline'
  | 'CauseEffect';
;

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


export type SceneData = HeroSceneData | ComparisonSceneData | StatisticSceneData | TimelineSceneData | CauseEffectSceneData;

export interface ExplainerClip {
  id: string;
  title: string;
  hook: string;
  takeaway: string;
  scenes: SceneData[];
}
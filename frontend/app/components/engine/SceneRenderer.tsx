// src/components/engine/SceneRenderer.tsx
import React from "react";
import { SceneData, SceneTemplate } from "../../types/schema";
import { HeroScene } from "./scenes/HeroScene";
import { ComparisonScene } from "./scenes/ComparisonScene";
import { StatisticScene } from "./scenes/StatisticScene";
import { TimelineScene } from "./scenes/TimelineScene";
import { CauseEffectScene } from "./scenes/CauseEffectScene";
import { BridgeScene } from "./scenes/BridgeScene";

type SceneComponent = React.FC<{ data: never; isActive: boolean }>;

// 1. The Registry Dictionary: Maps schema strings to React components
const SCENE_REGISTRY: Record<SceneTemplate, SceneComponent> = {
  Hero: HeroScene as unknown as SceneComponent,
  Comparison: ComparisonScene as unknown as SceneComponent,
  Statistic: StatisticScene as unknown as SceneComponent,
  Timeline: TimelineScene as unknown as SceneComponent,
  CauseEffect: CauseEffectScene as unknown as SceneComponent,
  Bridge: BridgeScene as unknown as SceneComponent,
};

interface Props {
  scene: SceneData;
  isActive: boolean;
}

export const SceneRenderer: React.FC<Props> = ({ scene, isActive }) => {
  // 2. Look up the correct component in our dictionary
  const Component = SCENE_REGISTRY[scene.template];

  // 3. Graceful Fallback (in case the AI ever hallucinates an unknown template!)
  if (!Component) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 bg-red-950/40 text-red-300 rounded-2xl border border-red-500/30">
        <p className="text-sm">
          ⚠️ Unknown learning template:{" "}
          <code className="font-mono">{scene.template}</code>
        </p>
      </div>
    );
  }

  // 4. Render the matched component
  return (
    <div className="w-full h-full">
      <Component data={scene as never} isActive={isActive} />
    </div>
  );
};

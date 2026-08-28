import { Type } from '@google/genai';

const sceneProps = {
  id: { type: Type.STRING },
  template: {
    type: Type.STRING,
    enum: ['Hero', 'Comparison', 'Statistic', 'Timeline', 'CauseEffect'],
  },
  icon: {
    type: Type.STRING,
    enum: ['cpu','shield','zap','trending-up','database','cloud','lock','bug','rocket','globe','code','brain'],
  },
  duration: { type: Type.NUMBER },

  // Hero
  title: { type: Type.STRING },
  subtitle: { type: Type.STRING },
  tag: { type: Type.STRING },

  // Comparison
  topic: { type: Type.STRING },
  leftLabel: { type: Type.STRING },
  leftValue: { type: Type.STRING },
  rightLabel: { type: Type.STRING },
  rightValue: { type: Type.STRING },
  leftDomain: { type: Type.STRING },
  rightDomain: { type: Type.STRING },
  emphasis: { type: Type.STRING, enum: ['left', 'right', 'none'] },

  // Statistic
  label: { type: Type.STRING },
  value: { type: Type.STRING },
  context: { type: Type.STRING },
  trend: { type: Type.STRING, enum: ['up', 'down', 'neutral'] },

  // Timeline
  steps: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: { label: { type: Type.STRING }, text: { type: Type.STRING } },
      required: ['label', 'text'],
    },
  },

  // CauseEffect
  cause: { type: Type.STRING },
  effect: { type: Type.STRING },
  causeLabel: { type: Type.STRING },
  effectLabel: { type: Type.STRING },
};

export const EXPLAINER_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    hook: { type: Type.STRING },
    takeaway: { type: Type.STRING },
    category: {
      type: Type.STRING,
      enum: ['AI','PROGRAMMING','CYBERSECURITY','STARTUPS','CLOUD','HARDWARE','MOBILE','OPEN_SOURCE'],
    },
    scenes: {
      type: Type.ARRAY,
      items: { type: Type.OBJECT, properties: sceneProps, required: ['id', 'template'] },
    },
  },
  required: ['title', 'hook', 'takeaway', 'category', 'scenes'],
};
import type { Tradition, EmotionalState } from './types';

export function assignPlan(tradition: Tradition, state: EmotionalState): string {
  return `${tradition}__${state}`;
}

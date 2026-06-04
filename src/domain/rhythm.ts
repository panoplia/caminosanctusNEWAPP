export const WINDOW_DAYS = 30;
export const GRACE_DAYS = 3;

export type RopeState = 'woven' | 'fraying' | 'frayed' | 'reset';

export interface RhythmWindow {
  engaged: boolean[];
  graceUsed: number;
}

export function computeRhythm(days: { date: string; engaged: boolean }[], today: string): RhythmWindow {
  const sortedAsc = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const window30 = sortedAsc.slice(-WINDOW_DAYS);
  const missed = window30.filter((d) => !d.engaged).length;
  const graceUsed = Math.min(missed, GRACE_DAYS);
  return { engaged: window30.map((d) => d.engaged), graceUsed };
}

export function getRopeState(graceUsed: number): RopeState {
  if (graceUsed === 0) return 'woven';
  if (graceUsed === 1 || graceUsed === 2) return 'fraying';
  if (graceUsed >= 3) return 'frayed';
  return 'reset';
}

export function graceRemaining(graceUsed: number): number {
  return Math.max(0, GRACE_DAYS - graceUsed);
}

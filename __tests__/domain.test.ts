import { describe, it, expect } from 'vitest';
import { assignPlan } from '../src/domain/plans';
import { canReadFullPrayer, mockTrialWindow, TRIAL_DAYS } from '../src/domain/subscription';
import { computeRhythm, getRopeState, graceRemaining, GRACE_DAYS } from '../src/domain/rhythm';
import type { Tradition, EmotionalState } from '../src/domain/types';

describe('assignPlan', () => {
  it('returns plan id based on tradition + state', () => {
    expect(assignPlan('catholic', 'anxiety')).toBe('catholic__anxiety');
    expect(assignPlan('orthodox', 'grief')).toBe('orthodox__grief');
    expect(assignPlan('neither', 'other')).toBe('neither__other');
  });

  it('covers all 8 emotional states x 3 traditions', () => {
    const traditions: Tradition[] = ['catholic', 'orthodox', 'neither'];
    const states: EmotionalState[] = ['anxiety', 'grief', 'guilt', 'addiction', 'purpose', 'relationship', 'faith_doubt', 'other'];
    for (const t of traditions) {
      for (const s of states) {
        expect(assignPlan(t, s)).toBe(`${t}__${s}`);
      }
    }
  });
});

describe('canReadFullPrayer', () => {
  it('returns true when entitled', () => {
    expect(canReadFullPrayer({ entitled: true, inTrial: false })).toBe(true);
  });

  it('returns true when inTrial', () => {
    expect(canReadFullPrayer({ entitled: false, inTrial: true })).toBe(true);
  });

  it('returns false when neither entitled nor inTrial', () => {
    expect(canReadFullPrayer({ entitled: false, inTrial: false })).toBe(false);
  });
});

describe('mockTrialWindow', () => {
  it('shows inTrial=true at day 0', () => {
    const start = 1000000;
    const result = mockTrialWindow(start, start);
    expect(result.inTrial).toBe(true);
    expect(result.entitled).toBe(false);
  });

  it('shows inTrial=true on day 16', () => {
    const start = 1000000;
    const day16 = start + 16 * 24 * 60 * 60 * 1000;
    const result = mockTrialWindow(start, day16);
    expect(result.inTrial).toBe(true);
  });

  it('shows inTrial=false after trial ends', () => {
    const start = 1000000;
    const after = start + (TRIAL_DAYS + 1) * 24 * 60 * 60 * 1000;
    const result = mockTrialWindow(start, after);
    expect(result.inTrial).toBe(false);
  });

  it('trial lasts exactly TRIAL_DAYS days', () => {
    const start = 0;
    const justBefore = start + TRIAL_DAYS * 24 * 60 * 60 * 1000 - 1;
    const atEnd = start + TRIAL_DAYS * 24 * 60 * 60 * 1000;
    expect(mockTrialWindow(start, justBefore).inTrial).toBe(true);
    expect(mockTrialWindow(start, atEnd).inTrial).toBe(false);
  });
});

describe('rhythm + grace math', () => {
  it('graceRemaining = GRACE_DAYS when nothing missed', () => {
    expect(graceRemaining(0)).toBe(GRACE_DAYS);
  });

  it('graceRemaining clamps to 0', () => {
    expect(graceRemaining(5)).toBe(0);
  });

  it('getRopeState: woven when 0 grace used', () => {
    expect(getRopeState(0)).toBe('woven');
  });

  it('getRopeState: fraying at 1-2', () => {
    expect(getRopeState(1)).toBe('fraying');
    expect(getRopeState(2)).toBe('fraying');
  });

  it('getRopeState: frayed at 3', () => {
    expect(getRopeState(3)).toBe('frayed');
  });

  it('computeRhythm counts missed days correctly', () => {
    const days = [
      { date: '2026-06-01', engaged: true },
      { date: '2026-06-02', engaged: false },
      { date: '2026-06-03', engaged: true },
      { date: '2026-06-04', engaged: false },
    ];
    const { graceUsed } = computeRhythm(days, '2026-06-04');
    expect(graceUsed).toBe(2);
  });
});

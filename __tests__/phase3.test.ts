import { describe, it, expect } from 'vitest';
import { canReadFullPrayer, mockTrialWindow, TRIAL_DAYS } from '../src/domain/subscription';
import { assignPlan } from '../src/domain/plans';
import { getRopeState, graceRemaining, computeRhythm, GRACE_DAYS } from '../src/domain/rhythm';

// -- Plan assignment (classifier -> plan) --

describe('classifier → plan mapping', () => {
  it('catholic + anxiety maps to correct plan id', () => {
    expect(assignPlan('catholic', 'anxiety')).toBe('catholic__anxiety');
  });

  it('orthodox + grief maps to correct plan id', () => {
    expect(assignPlan('orthodox', 'grief')).toBe('orthodox__grief');
  });

  it('neither + addiction maps to correct plan id', () => {
    expect(assignPlan('neither', 'addiction')).toBe('neither__addiction');
  });
});

// -- canReadFullPrayer gating --

describe('canReadFullPrayer paywall gating', () => {
  it('blocks when neither entitled nor in trial', () => {
    expect(canReadFullPrayer({ entitled: false, inTrial: false })).toBe(false);
  });

  it('allows when entitled', () => {
    expect(canReadFullPrayer({ entitled: true, inTrial: false })).toBe(true);
  });

  it('allows when in trial', () => {
    expect(canReadFullPrayer({ entitled: false, inTrial: true })).toBe(true);
  });

  it('allows when both entitled and in trial (edge)', () => {
    expect(canReadFullPrayer({ entitled: true, inTrial: true })).toBe(true);
  });
});

// -- Mock trial window --

describe('mock trial-window logic', () => {
  it('17-day trial starts on day 0 as inTrial', () => {
    const start = 0;
    const result = mockTrialWindow(start, start);
    expect(result.inTrial).toBe(true);
    expect(result.entitled).toBe(false);
    expect(result.trialEndsAt).toBe(start + TRIAL_DAYS * 86400000);
  });

  it('inTrial true on day 1', () => {
    const start = 0;
    expect(mockTrialWindow(start, 86400000).inTrial).toBe(true);
  });

  it('inTrial false on day 17 (expired)', () => {
    const start = 0;
    expect(mockTrialWindow(start, TRIAL_DAYS * 86400000).inTrial).toBe(false);
  });

  it('TRIAL_DAYS is exactly 17', () => {
    expect(TRIAL_DAYS).toBe(17);
  });
});

// -- Rhythm / grace-day math --

describe('rhythm + rope states', () => {
  it('woven when no grace used', () => {
    expect(getRopeState(0)).toBe('woven');
  });

  it('fraying at 1 grace day used', () => {
    expect(getRopeState(1)).toBe('fraying');
  });

  it('fraying at 2 grace days used', () => {
    expect(getRopeState(2)).toBe('fraying');
  });

  it('frayed at 3 grace days used (max)', () => {
    expect(getRopeState(3)).toBe('frayed');
  });

  it('frayed even if more than 3 missed (clamped)', () => {
    expect(getRopeState(10)).toBe('frayed');
  });

  it('graceRemaining = 3 at start', () => {
    expect(graceRemaining(0)).toBe(3);
  });

  it('graceRemaining = 1 after 2 missed', () => {
    expect(graceRemaining(2)).toBe(1);
  });

  it('graceRemaining clamps to 0, never negative', () => {
    expect(graceRemaining(5)).toBe(0);
  });

  it('computeRhythm: 0 missed → graceUsed=0', () => {
    const days = [
      { date: '2026-06-01', engaged: true },
      { date: '2026-06-02', engaged: true },
      { date: '2026-06-03', engaged: true },
    ];
    expect(computeRhythm(days, '2026-06-03').graceUsed).toBe(0);
  });

  it('computeRhythm: 3 missed → graceUsed=3', () => {
    const days = [
      { date: '2026-06-01', engaged: false },
      { date: '2026-06-02', engaged: false },
      { date: '2026-06-03', engaged: false },
    ];
    expect(computeRhythm(days, '2026-06-03').graceUsed).toBe(3);
  });

  it('computeRhythm: >3 missed still clamps to GRACE_DAYS', () => {
    const days = Array.from({ length: 10 }, (_, i) => ({
      date: `2026-06-${String(i + 1).padStart(2, '0')}`,
      engaged: false,
    }));
    expect(computeRhythm(days, '2026-06-10').graceUsed).toBe(GRACE_DAYS);
  });
});

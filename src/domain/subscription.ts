import type { SubscriptionState } from './types';

export const TRIAL_DAYS = 21;

export function canReadFullPrayer(state: SubscriptionState): boolean {
  return state.entitled || state.inTrial;
}

export function mockTrialWindow(startedAtMs: number, nowMs: number): SubscriptionState {
  const trialEndsAt = startedAtMs + TRIAL_DAYS * 24 * 60 * 60 * 1000;
  const inTrial = nowMs < trialEndsAt;
  return { entitled: false, inTrial, trialEndsAt };
}

import type { SubscriptionService } from './interface';
import type { SubscriptionState } from '@/domain/types';
import { mockTrialWindow, TRIAL_DAYS } from '@/domain/subscription';

let _state: SubscriptionState = { entitled: false, inTrial: false };
let _trialStartedAt: number | null = null;

export const mockSubscriptionService: SubscriptionService = {
  async getState(): Promise<SubscriptionState> {
    if (_trialStartedAt !== null) {
      return mockTrialWindow(_trialStartedAt, Date.now());
    }
    return _state;
  },

  async startTrial(): Promise<void> {
    _trialStartedAt = Date.now();
    _state = mockTrialWindow(_trialStartedAt, _trialStartedAt);
  },

  async restore(): Promise<void> {
    // mock: nothing to restore
  },
};

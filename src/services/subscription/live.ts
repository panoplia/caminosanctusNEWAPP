import type { SubscriptionService } from './interface';
import type { SubscriptionState } from '@/domain/types';

// Stub — wired when RevenueCat is configured (🔒 human gate)
// Uses react-native-purchases under the hood
export const liveSubscriptionService: SubscriptionService = {
  async getState(): Promise<SubscriptionState> {
    throw new Error('Live SubscriptionService not yet configured. Add RevenueCat API key.');
  },
  async startTrial(): Promise<void> {
    throw new Error('Live SubscriptionService not yet configured.');
  },
  async restore(): Promise<void> {
    throw new Error('Live SubscriptionService not yet configured.');
  },
};

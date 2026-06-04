import type { SubscriptionState } from '@/domain/types';

export interface SubscriptionService {
  getState(): Promise<SubscriptionState>;
  startTrial(): Promise<void>;
  restore(): Promise<void>;
}

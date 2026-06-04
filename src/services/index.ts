import { isMock } from '@/config/env';
import { mockPrayerService } from './prayer/mock';
import { livePrayerService } from './prayer/live';
import { mockSubscriptionService } from './subscription/mock';
import { liveSubscriptionService } from './subscription/live';
import { mockAuthService } from './auth/mock';
import { liveAuthService } from './auth/live';

export const prayerService = isMock ? mockPrayerService : livePrayerService;
export const subscriptionService = isMock ? mockSubscriptionService : liveSubscriptionService;
export const authService = isMock ? mockAuthService : liveAuthService;

export type { PrayerService } from './prayer/interface';
export type { SubscriptionService } from './subscription/interface';
export type { AuthService } from './auth/interface';

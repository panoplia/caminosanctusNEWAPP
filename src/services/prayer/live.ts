import type { PrayerService } from './interface';
import type { Intake, Passage, Prayer } from '@/domain/types';

// Stub — wired when EXPO_PUBLIC_SUPABASE_URL + auth are configured (🔒 human gate)
export const livePrayerService: PrayerService = {
  async generate(_intake: Intake, _passages: Passage[]): Promise<Prayer> {
    throw new Error('Live PrayerService not yet configured. Set EXPO_PUBLIC_APP_MODE=live and add Supabase credentials.');
  },
};

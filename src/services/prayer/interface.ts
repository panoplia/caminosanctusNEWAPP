import type { Intake, Passage, Prayer } from '@/domain/types';

export interface PrayerService {
  generate(intake: Intake, passages: Passage[]): Promise<Prayer>;
}

export type Tradition = 'catholic' | 'orthodox' | 'neither';
export type EmotionalState =
  | 'anxiety'
  | 'grief'
  | 'guilt'
  | 'addiction'
  | 'purpose'
  | 'relationship'
  | 'faith_doubt'
  | 'other';
export type Rating = 'helpful' | 'not_helpful';

export interface Intake {
  burdenText: string;
  tradition: Tradition;
  name: string;
  emotionalState: EmotionalState;
}

export interface Passage {
  ref: string;
  text: string;
  tradition: Tradition | 'shared';
  emotionalState: EmotionalState;
}

export interface Prayer {
  id: string;
  intakeId: string;
  body: string;
  emotionalState: EmotionalState;
  tradition: Tradition;
  moodTag?: string;
  rating?: Rating;
  createdAt: number;
  passages?: Passage[];         // curated (free) or AI-selected (premium)
  passagesAiSelected?: boolean; // true = AI-selected, requires subscription
}

export interface Plan {
  id: string;
  tradition: Tradition;
  emotionalState: EmotionalState;
  days: PlanDay[];
  draft?: boolean;
}

export interface PlanDay {
  passageRef: string;
  whyThisForYou: string;
}

export interface PlanAssignment {
  id: string;
  planId: string;
  currentDay: number;
  startedAt: number;
}

export interface RhythmDay {
  date: string;
  engaged: boolean;
}

export interface MoodCheckin {
  date: string;
  moodTag: string;
}

export interface SubscriptionState {
  entitled: boolean;
  inTrial: boolean;
  trialEndsAt?: number;
}

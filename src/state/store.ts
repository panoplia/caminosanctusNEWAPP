import { create } from 'zustand';
import type { Prayer, SubscriptionState, Tradition, EmotionalState } from '@/domain/types';

interface AppState {
  // Onboarding
  burdenText: string;
  tradition: Tradition | null;
  name: string;

  // Current prayer session
  currentPrayer: Prayer | null;
  isGenerating: boolean;

  // Subscription
  subscription: SubscriptionState;

  // Actions
  setOnboarding: (fields: { burdenText?: string; tradition?: Tradition; name?: string }) => void;
  setPrayer: (p: Prayer | null) => void;
  setGenerating: (v: boolean) => void;
  setSubscription: (s: SubscriptionState) => void;
}

export const useAppStore = create<AppState>((set) => ({
  burdenText: '',
  tradition: null,
  name: '',
  currentPrayer: null,
  isGenerating: false,
  subscription: { entitled: false, inTrial: false },

  setOnboarding: (fields) => set((s) => ({ ...s, ...fields })),
  setPrayer: (p) => set({ currentPrayer: p }),
  setGenerating: (v) => set({ isGenerating: v }),
  setSubscription: (sub) => set({ subscription: sub }),
}));

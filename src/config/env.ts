import Constants from 'expo-constants';

type AppMode = 'mock' | 'live';

export const APP_MODE: AppMode =
  (Constants.expoConfig?.extra?.appMode as AppMode) ??
  (process.env.EXPO_PUBLIC_APP_MODE as AppMode) ??
  'mock';

export const isMock = APP_MODE === 'mock';

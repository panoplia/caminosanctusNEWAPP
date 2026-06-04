import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Cormorant_500Medium } from '@expo-google-fonts/cormorant';
import { Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useEffect } from 'react';
import { initSchema } from '@/db/schema';
import { useColorScheme } from 'react-native';
import { configureNotificationHandler, schedulePrayerReminders } from '@/services/notifications';
import { getProfile } from '@/db/repos';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Cormorant_500Medium,
    Inter_400Regular,
    Inter_600SemiBold,
  });

  useEffect(() => {
    try {
      initSchema();
    } catch (e) {
      console.warn('DB init error:', e);
    }

    // Configure notification display behavior
    configureNotificationHandler();

    // Schedule prayer reminders (2/week) once profile exists
    try {
      const profile = getProfile();
      if (profile) {
        schedulePrayerReminders(profile.name).catch(() => {});
      }
    } catch {}
  }, []);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colorScheme === 'dark' ? '#1B1714' : '#F4EEE2' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="prayer" />
        <Stack.Screen name="paywall" />
        <Stack.Screen name="(app)" />
      </Stack>
    </SafeAreaProvider>
  );
}

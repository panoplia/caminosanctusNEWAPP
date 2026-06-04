import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, useColorScheme } from 'react-native';
import { getProfile } from '@/db/repos';
import { Colors } from '@/design/tokens';

export default function Root() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? Colors.dark : Colors.light;

  useEffect(() => {
    try {
      const profile = getProfile();
      if (profile) {
        router.replace('/(app)/today');
      } else {
        router.replace('/(onboarding)/burden');
      }
    } catch {
      router.replace('/(onboarding)/burden');
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.parchment, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={colors.candle} />
    </View>
  );
}

import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen, PrayerText, FeedbackTap, PriestPointer } from '@/design/components';
import { useColors } from '@/design/components';
import { useAppStore } from '@/state/store';
import { useShallow } from 'zustand/react/shallow';
import { prayerService } from '@/services';
import { Colors, Spacing, Typography } from '@/design/tokens';
import type { Rating, Tradition } from '@/domain/types';
import { savePrayer, updatePrayerRating } from '@/db/repos';

export default function PrayerScreen() {
  const colors = useColors();
  const { burdenText, tradition, name, setPrayer, setGenerating, isGenerating, currentPrayer, setSubscription } = useAppStore(useShallow((s) => ({
    burdenText: s.burdenText,
    tradition: s.tradition,
    name: s.name,
    setPrayer: s.setPrayer,
    setGenerating: s.setGenerating,
    isGenerating: s.isGenerating,
    currentPrayer: s.currentPrayer,
    setSubscription: s.setSubscription,
  })));

  const [rating, setRating] = useState<Rating | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentPrayer || isGenerating) return;
    generate();
  }, []);

  async function generate() {
    if (!burdenText || !tradition || !name) {
      setError('Faltan datos del formulario. Vuelve al inicio.');
      return;
    }
    setGenerating(true);
    try {
      const prayer = await prayerService.generate(
        { burdenText, tradition: tradition as Tradition, name, emotionalState: 'anxiety' },
        [],
      );
      setPrayer(prayer);
      savePrayer(prayer);
    } catch (e) {
      setError('No pudimos generar tu oración. Intenta de nuevo.');
      console.warn('Prayer generation error:', e);
    } finally {
      setGenerating(false);
    }
  }

  function handleRating(r: Rating) {
    setRating(r);
    if (currentPrayer) {
      updatePrayerRating(currentPrayer.id, r);
    }
    // Short delay then show paywall
    setTimeout(() => {
      router.push('/paywall');
    }, 1400);
  }

  if (isGenerating || (!currentPrayer && !error)) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.parchment, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.candle} size="large" />
        <Text style={{ ...Typography.caption, color: colors.stone, marginTop: Spacing.base }}>
          Escribiendo tu oración…
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.parchment, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl }}>
        <Text style={{ ...Typography.body, color: colors.ink, textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  const prayer = currentPrayer!;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.parchment }} contentContainerStyle={{ padding: Spacing.lg, paddingTop: Spacing.xxxl, paddingBottom: Spacing.xxxl }}>
      <PrayerText body={prayer.body} />

      {/* Bible passages — curated (free) */}
      {prayer.passages && prayer.passages.length > 0 && (
        <View style={{ marginTop: Spacing.xl, borderTopWidth: 1, borderTopColor: colors.hairline, paddingTop: Spacing.lg }}>
          <Text style={{ ...Typography.caption, color: colors.stone, fontFamily: 'Inter_400Regular', letterSpacing: 0.8, marginBottom: Spacing.base }}>
            FUNDAMENTO BÍBLICO
          </Text>
          {prayer.passages.map((p) => (
            <View key={p.ref} style={{ marginBottom: Spacing.lg }}>
              <Text style={{ ...Typography.caption, color: colors.candle, fontFamily: 'Inter_600SemiBold', marginBottom: Spacing.xs }}>
                {p.ref}
              </Text>
              <Text style={{ ...Typography.body, color: colors.ink, fontFamily: 'Cormorant_500Medium', fontStyle: 'italic', lineHeight: 26 }}>
                "{p.text}"
              </Text>
            </View>
          ))}
        </View>
      )}

      <PriestPointer tradition={prayer.tradition} />
      <FeedbackTap
        onHelpful={() => handleRating('helpful')}
        onNotHelpful={() => handleRating('not_helpful')}
        selected={rating}
      />
    </ScrollView>
  );
}

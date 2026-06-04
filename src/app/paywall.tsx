import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Screen, PrayerText, BlurVeil, PriestPointer, PrimaryButton, TextButton } from '@/design/components';
import { useColors } from '@/design/components';
import { useAppStore } from '@/state/store';
import { subscriptionService } from '@/services';
import { canReadFullPrayer } from '@/domain/subscription';
import { Spacing, Typography, Colors } from '@/design/tokens';
import { useState, useEffect } from 'react';
import type { SubscriptionState } from '@/domain/types';

export default function PaywallScreen() {
  const colors = useColors();
  const { currentPrayer, subscription, setSubscription } = useAppStore((s) => ({
    currentPrayer: s.currentPrayer,
    subscription: s.subscription,
    setSubscription: s.setSubscription,
  }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    subscriptionService.getState().then(setSubscription).catch(() => {});
  }, []);

  const canRead = canReadFullPrayer(subscription);

  async function startTrial() {
    setLoading(true);
    setError(null);
    try {
      await subscriptionService.startTrial();
      const state = await subscriptionService.getState();
      setSubscription(state);
    } catch (e) {
      setError('No pudimos iniciar la prueba. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  if (canRead && currentPrayer) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.parchment }}
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: Spacing.xxxl }}>
        <Text style={{ ...Typography.caption, color: colors.stone, fontFamily: 'Inter_400Regular', marginBottom: Spacing.base }}>
          PRUEBA ACTIVA
        </Text>
        <PrayerText body={currentPrayer.body} />
        <PriestPointer tradition={currentPrayer.tradition} />
        <View style={{ marginTop: Spacing.xl }}>
          <PrimaryButton label="Ir a mi plan de hoy" onPress={() => router.replace('/(app)/today')} />
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.parchment }}>
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 280 }}>
        {currentPrayer && (
          <>
            <Text style={{ ...Typography.prayerLead, color: colors.ink, fontFamily: 'Cormorant_500Medium' }}>
              {currentPrayer.body.split('\n')[0]}
            </Text>
            <Text style={{ ...Typography.prayerBody, color: colors.ink, fontFamily: 'Cormorant_500Medium', marginTop: Spacing.sm }}>
              {currentPrayer.body.split('\n').slice(1, 3).join('\n')}
            </Text>
          </>
        )}
      </ScrollView>

      {/* Blur veil over remaining text */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: colors.parchment,
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.xxxl,
        borderTopWidth: 1,
        borderTopColor: colors.hairline,
      }}>
        <Text style={{ ...Typography.body, color: colors.ink, textAlign: 'center', fontFamily: 'Inter_400Regular', marginBottom: Spacing.sm }}>
          Esta oración fue escrita para ti.
        </Text>
        <Text style={{ ...Typography.caption, color: colors.stone, textAlign: 'center', fontFamily: 'Inter_400Regular', marginBottom: Spacing.lg }}>
          Comienza tu prueba gratuita de 17 días para leerla completa.
        </Text>

        {/* Almsgiving line — flagged as DRAFT, must not ship live without promo program */}
        {/* 🔒 HANDOFF: almsgiving copy must NOT go live until promo-code program exists */}
        {/* <Text style={{ ...Typography.caption, color: colors.stone, textAlign: 'center', fontStyle: 'italic', marginBottom: Spacing.lg }}>
          Tu suscripción patrocina un mes gratis para alguien en tu comunidad que no puede pagar.
        </Text> */}

        <PrimaryButton
          label={loading ? 'Un momento…' : 'Comenzar prueba gratuita de 17 días'}
          onPress={startTrial}
          disabled={loading}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: Spacing.xl, marginTop: Spacing.base }}>
          <TouchableOpacity onPress={() => {}}>
            <Text style={{ ...Typography.caption, color: colors.stone }}>Mensual $4.99</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Text style={{ ...Typography.caption, color: colors.stone }}>Anual $39.99</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <Text style={{ ...Typography.caption, color: colors.ember, textAlign: 'center', marginTop: Spacing.sm }}>
            {error}
          </Text>
        )}

        <TextButton label="Restaurar compra" onPress={async () => {
          try { await subscriptionService.restore(); } catch {}
        }} />
      </View>
    </View>
  );
}

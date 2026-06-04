import { View, Text } from 'react-native';
import { Screen } from '@/design/components';
import { useColors } from '@/design/components';
import { Spacing, Typography, Colors } from '@/design/tokens';
import { getRhythmDays } from '@/db/repos';
import { computeRhythm, getRopeState, graceRemaining, GRACE_DAYS } from '@/domain/rhythm';
import { router } from 'expo-router';
import { TextButton } from '@/design/components';

const ROPE_LABELS: Record<string, string> = {
  woven: 'Cuerda tejida — sin faltar',
  fraying: 'Algunas hebras sueltas — sigue adelante',
  frayed: 'Tensa pero entera — puede reanudarse',
  reset: 'Ventana nueva — todo puede retejerse',
};

const ROPE_COLORS: Record<string, string> = {
  woven: '#C9A24B',
  fraying: '#A6822F',
  frayed: '#8C3B2E',
  reset: '#4F7A52',
};

export default function RhythmScreen() {
  const colors = useColors();
  const today = new Date().toISOString().slice(0, 10);
  const days = getRhythmDays(30);
  const { graceUsed } = computeRhythm(days, today);
  const ropeState = getRopeState(graceUsed);
  const remaining = graceRemaining(graceUsed);

  return (
    <Screen>
      <View style={{ marginTop: Spacing.xl }}>
        <Text style={{ ...Typography.screenTitle, color: colors.ink, fontFamily: 'Inter_600SemiBold' }}>
          Tu ritmo
        </Text>
      </View>

      <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: Spacing.lg, marginTop: Spacing.xl, alignItems: 'center' }}>
        <View style={{ width: 8, height: 80, backgroundColor: ROPE_COLORS[ropeState], borderRadius: 4, marginBottom: Spacing.base }} />
        <Text style={{ ...Typography.body, color: colors.ink, fontFamily: 'Inter_600SemiBold', textAlign: 'center' }}>
          {ROPE_LABELS[ropeState]}
        </Text>
        <Text style={{ ...Typography.caption, color: colors.stone, marginTop: Spacing.sm, textAlign: 'center', fontFamily: 'Inter_400Regular' }}>
          {remaining} de {GRACE_DAYS} días de gracia restantes
        </Text>
      </View>

      <View style={{ marginTop: Spacing.lg }}>
        <Text style={{ ...Typography.caption, color: colors.stone, fontFamily: 'Inter_400Regular' }}>
          La cuerda no se corta — puede retejerse siempre.
        </Text>
      </View>

      <View style={{ marginTop: Spacing.xl }}>
        <TextButton label="Volver" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

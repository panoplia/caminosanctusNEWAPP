import { View, Text, ScrollView } from 'react-native';
import { Screen, PrimaryButton } from '@/design/components';
import { useColors } from '@/design/components';
import { Spacing, Typography } from '@/design/tokens';
import { getPlanAssignment, getProfile } from '@/db/repos';
import { router } from 'expo-router';

export default function TodayScreen() {
  const colors = useColors();
  const profile = getProfile();
  const assignment = getPlanAssignment();

  return (
    <Screen scrollable>
      <View style={{ marginTop: Spacing.xl }}>
        <Text style={{ ...Typography.screenTitle, color: colors.ink, fontFamily: 'Inter_600SemiBold' }}>
          Buen día{profile?.name ? `, ${profile.name}` : ''}.
        </Text>
        <Text style={{ ...Typography.caption, color: colors.stone, marginTop: Spacing.xs, fontFamily: 'Inter_400Regular' }}>
          {new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>
      </View>

      <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: Spacing.lg, marginTop: Spacing.xl }}>
        <Text style={{ ...Typography.caption, color: colors.stone, fontFamily: 'Inter_400Regular', marginBottom: Spacing.sm }}>
          LECTURA DE HOY
        </Text>
        {assignment ? (
          <>
            <Text style={{ ...Typography.prayerBody, color: colors.ink, fontFamily: 'Cormorant_500Medium' }}>
              Día {assignment.currentDay} — Plan de lectura
            </Text>
            <Text style={{ ...Typography.body, color: colors.stone, marginTop: Spacing.sm, fontFamily: 'Inter_400Regular' }}>
              Pasajes y notas aparecerán aquí cuando el plan esté completo con contenido verificado.
            </Text>
          </>
        ) : (
          <Text style={{ ...Typography.body, color: colors.stone, fontFamily: 'Inter_400Regular' }}>
            No hay plan asignado todavía. Completa el proceso de ingreso para comenzar.
          </Text>
        )}
      </View>

      <View style={{ marginTop: Spacing.lg }}>
        <PrimaryButton label="Nueva oración" onPress={() => router.push('/prayer')} />
        <PrimaryButton label="Ver mi ritmo" onPress={() => router.push('/(app)/rhythm')} />
      </View>
    </Screen>
  );
}

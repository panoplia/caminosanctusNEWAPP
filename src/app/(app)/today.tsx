import { View, Text, ScrollView } from 'react-native';
import { Screen, PrimaryButton } from '@/design/components';
import { useColors } from '@/design/components';
import { Spacing, Typography } from '@/design/tokens';
import { getPlanAssignment, getProfile } from '@/db/repos';
import { getPlanDay } from '@/data/plans';
import { router } from 'expo-router';

export default function TodayScreen() {
  const colors = useColors();
  const profile = getProfile();
  const assignment = getPlanAssignment();

  const planDay = assignment
    ? getPlanDay(assignment.planId, assignment.currentDay)
    : undefined;

  const todayLabel = new Date().toLocaleDateString('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <Screen scrollable>
      <View style={{ marginTop: Spacing.xl }}>
        <Text style={{ ...Typography.screenTitle, color: colors.ink, fontFamily: 'Inter_600SemiBold' }}>
          Buen día{profile?.name ? `, ${profile.name}` : ''}.
        </Text>
        <Text style={{ ...Typography.caption, color: colors.stone, marginTop: Spacing.xs, fontFamily: 'Inter_400Regular' }}>
          {todayLabel}
        </Text>
      </View>

      <View style={{
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: Spacing.lg,
        marginTop: Spacing.xl,
        borderWidth: 1,
        borderColor: colors.hairline,
      }}>
        <Text style={{ ...Typography.caption, color: colors.stone, fontFamily: 'Inter_400Regular', marginBottom: Spacing.sm, letterSpacing: 0.8 }}>
          LECTURA DE HOY
        </Text>

        {planDay ? (
          <>
            <Text style={{ ...Typography.prayerLead, color: colors.ink, fontFamily: 'Cormorant_500Medium' }}>
              {planDay.passageRef}
            </Text>
            <Text style={{ ...Typography.body, color: colors.stone, marginTop: Spacing.base, fontFamily: 'Inter_400Regular', lineHeight: 24 }}>
              {planDay.whyThisForYou}
            </Text>
            {assignment && (
              <Text style={{ ...Typography.caption, color: colors.stone, marginTop: Spacing.lg, fontFamily: 'Inter_400Regular' }}>
                Día {assignment.currentDay} de tu plan
              </Text>
            )}
          </>
        ) : (
          <Text style={{ ...Typography.body, color: colors.stone, fontFamily: 'Inter_400Regular' }}>
            Completa el proceso de ingreso para comenzar tu plan de lectura.
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

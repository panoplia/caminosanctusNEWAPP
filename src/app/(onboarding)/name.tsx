import { useState } from 'react';
import { TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Screen, QuestionPrompt, PrimaryButton } from '@/design/components';
import { useColors } from '@/design/components';
import { useAppStore } from '@/state/store';
import { useShallow } from 'zustand/react/shallow';
import { Spacing, Radii, Typography } from '@/design/tokens';
import { saveProfile } from '@/db/repos';
import { assignPlan } from '@/domain/plans';
import { savePlanAssignment } from '@/db/repos';
import type { Tradition, EmotionalState } from '@/domain/types';

export default function NameScreen() {
  const colors = useColors();
  const { burdenText, tradition, setOnboarding } = useAppStore(useShallow((s) => ({
    burdenText: s.burdenText,
    tradition: s.tradition,
    setOnboarding: s.setOnboarding,
  })));
  const [name, setName] = useState('');
  const valid = name.trim().length >= 1;

  function finish() {
    if (!valid || !tradition) return;
    const trimmed = name.trim();
    setOnboarding({ name: trimmed });
    try {
      saveProfile(trimmed, tradition, burdenText);
      const planId = assignPlan(tradition as Tradition, 'anxiety' as EmotionalState);
      savePlanAssignment(planId);
    } catch (e) {
      console.warn('DB save error:', e);
    }
    router.replace('/prayer');
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Screen>
        <QuestionPrompt text="¿Cuál es tu nombre?" />
        <TextInput
          placeholder="Tu nombre"
          placeholderTextColor={colors.stone}
          value={name}
          onChangeText={setName}
          autoFocus
          style={{
            ...Typography.prayerBody,
            color: colors.ink,
            backgroundColor: colors.surface,
            borderRadius: Radii.md,
            padding: Spacing.base,
            borderWidth: 1,
            borderColor: colors.hairline,
          }}
        />
        <View style={{ marginTop: Spacing.xl }}>
          <PrimaryButton label="Generar mi oración" onPress={finish} disabled={!valid} />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

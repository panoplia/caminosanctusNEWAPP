import { useState } from 'react';
import { TextInput, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Screen, QuestionPrompt, PrimaryButton } from '@/design/components';
import { useColors } from '@/design/components';
import { useAppStore } from '@/state/store';
import { Colors, Spacing, Radii, Typography } from '@/design/tokens';

export default function BurdenScreen() {
  const colors = useColors();
  const setBurden = useAppStore((s) => s.setOnboarding);
  const [text, setText] = useState('');
  const valid = text.trim().length >= 20;

  function next() {
    if (!valid) return;
    setBurden({ burdenText: text.trim() });
    router.push('/(onboarding)/tradition');
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Screen scrollable>
        <QuestionPrompt text="¿Qué es lo más pesado que cargas en este momento? Dilo con tus propias palabras." />
        <TextInput
          multiline
          numberOfLines={6}
          placeholder="Escribe aquí…"
          placeholderTextColor={colors.stone}
          value={text}
          onChangeText={setText}
          style={{
            ...Typography.body,
            color: colors.ink,
            backgroundColor: colors.surface,
            borderRadius: Radii.md,
            padding: Spacing.base,
            minHeight: 140,
            textAlignVertical: 'top',
            borderWidth: 1,
            borderColor: colors.hairline,
          }}
        />
        {text.trim().length > 0 && text.trim().length < 20 && (
          <Text style={{ ...Typography.caption, color: colors.stone, marginTop: Spacing.sm }}>
            {20 - text.trim().length} caracteres más para continuar
          </Text>
        )}
        <View style={{ marginTop: Spacing.xl }}>
          <PrimaryButton label="Continuar" onPress={next} disabled={!valid} />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

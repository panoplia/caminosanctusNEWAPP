import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Screen, QuestionPrompt, PrimaryButton } from '@/design/components';
import { useColors } from '@/design/components';
import { useAppStore } from '@/state/store';
import { Colors, Spacing, Radii, Typography } from '@/design/tokens';
import type { Tradition } from '@/domain/types';
import { useState } from 'react';

const OPTIONS: { value: Tradition; label: string; sub: string }[] = [
  { value: 'catholic', label: 'Católico', sub: 'Tradición latina, Santos, María' },
  { value: 'orthodox', label: 'Ortodoxo', sub: 'Tradición oriental, hesicasmo' },
  { value: 'neither', label: 'Todavía lo estoy discerniendo', sub: 'Registro neutro y pastoral' },
];

export default function TraditionScreen() {
  const colors = useColors();
  const setOnboarding = useAppStore((s) => s.setOnboarding);
  const [selected, setSelected] = useState<Tradition | null>(null);

  function next() {
    if (!selected) return;
    setOnboarding({ tradition: selected });
    router.push('/(onboarding)/name');
  }

  return (
    <Screen>
      <QuestionPrompt text="¿Cuál es tu tradición?" />
      <View style={{ gap: Spacing.base }}>
        {OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            onPress={() => setSelected(opt.value)}
            style={{
              backgroundColor: selected === opt.value ? colors.candle + '33' : colors.surface,
              borderWidth: 1.5,
              borderColor: selected === opt.value ? colors.candle : colors.hairline,
              borderRadius: Radii.md,
              padding: Spacing.base,
            }}
          >
            <Text style={{ ...Typography.body, fontWeight: '600', color: colors.ink }}>{opt.label}</Text>
            <Text style={{ ...Typography.caption, color: colors.stone, marginTop: 2 }}>{opt.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ marginTop: Spacing.xl }}>
        <PrimaryButton label="Continuar" onPress={next} disabled={!selected} />
      </View>
    </Screen>
  );
}

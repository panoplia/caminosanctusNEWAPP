import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Screen, PrimaryButton, TextButton } from '@/design/components';
import { useColors } from '@/design/components';
import { Spacing, Typography, Radii } from '@/design/tokens';
import { useAppStore } from '@/state/store';
import { getDb } from '@/db/schema';
import { markRhythmDay } from '@/db/repos';

const MOOD_OPTIONS = [
  { tag: 'peace',        emoji: '🕊️',  label: 'Paz'         },
  { tag: 'gratitude',    emoji: '🙏',  label: 'Gratitud'    },
  { tag: 'tired',        emoji: '😮‍💨', label: 'Cansancio'  },
  { tag: 'anxious',      emoji: '😰',  label: 'Ansiedad'    },
  { tag: 'grief',        emoji: '💔',  label: 'Tristeza'    },
  { tag: 'hope',         emoji: '🌅',  label: 'Esperanza'   },
  { tag: 'dry',          emoji: '🌵',  label: 'Sequedad'    },
  { tag: 'joy',          emoji: '✨',  label: 'Alegría'     },
] as const;

type MoodTag = typeof MOOD_OPTIONS[number]['tag'];

function saveMoodCheckin(date: string, moodTag: string) {
  try {
    const db = getDb();
    db.runSync(
      'INSERT OR REPLACE INTO mood_checkin (date, mood_tag) VALUES (?, ?)',
      [date, moodTag],
    );
  } catch (e) {
    console.warn('mood checkin save error:', e);
  }
}

export default function CheckinScreen() {
  const colors = useColors();
  const [selected, setSelected] = useState<MoodTag | null>(null);
  const setOnboarding = useAppStore((s) => s.setOnboarding);

  const today = new Date().toISOString().slice(0, 10);

  function proceed() {
    if (!selected) return;
    saveMoodCheckin(today, selected);
    markRhythmDay(today, true);
    // Route to prayer with mood context so prayer tone can be adjusted
    router.push('/prayer');
  }

  function skip() {
    markRhythmDay(today, true);
    router.push('/prayer');
  }

  return (
    <Screen>
      <View style={{ marginTop: Spacing.xl }}>
        <Text style={{
          ...Typography.question,
          color: colors.ink,
          fontFamily: 'Cormorant_500Medium',
          marginBottom: Spacing.xl,
        }}>
          ¿Cómo llegas hoy?
        </Text>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
        {MOOD_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.tag}
            onPress={() => setSelected(opt.tag)}
            style={{
              width: '47%',
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.sm,
              backgroundColor: selected === opt.tag ? colors.candle + '33' : colors.surface,
              borderWidth: 1.5,
              borderColor: selected === opt.tag ? colors.candle : colors.hairline,
              borderRadius: Radii.md,
              paddingVertical: Spacing.base,
              paddingHorizontal: Spacing.base,
            }}
          >
            <Text style={{ fontSize: 22 }}>{opt.emoji}</Text>
            <Text style={{
              ...Typography.body,
              color: colors.ink,
              fontFamily: 'Inter_400Regular',
            }}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ marginTop: Spacing.xl }}>
        <PrimaryButton
          label="Orar desde aquí"
          onPress={proceed}
          disabled={!selected}
        />
        <TextButton label="Continuar sin responder" onPress={skip} />
      </View>
    </Screen>
  );
}

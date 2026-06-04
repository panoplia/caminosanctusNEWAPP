import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, Radii, Typography } from './tokens';

export function useColors() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? Colors.dark : Colors.light;
}

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

export function Screen({ children, scrollable = false }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const style = {
    flex: 1,
    backgroundColor: colors.parchment,
    paddingHorizontal: Spacing.lg,
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
  };
  if (scrollable) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.parchment }}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingTop: insets.top, paddingBottom: insets.bottom + Spacing.xl }}>
        {children}
      </ScrollView>
    );
  }
  return <View style={style}>{children}</View>;
}

interface QuestionPromptProps {
  text: string;
  fontFamily?: string;
}

export function QuestionPrompt({ text, fontFamily = 'Cormorant_500Medium' }: QuestionPromptProps) {
  const colors = useColors();
  return (
    <Text style={[Typography.question, { color: colors.ink, fontFamily, marginTop: Spacing.xxxl, marginBottom: Spacing.xl }]}>
      {text}
    </Text>
  );
}

interface PrayerTextProps {
  body: string;
  fontFamily?: string;
}

export function PrayerText({ body, fontFamily = 'Cormorant_500Medium' }: PrayerTextProps) {
  const colors = useColors();
  const lines = body.split('\n');
  return (
    <View style={{ maxWidth: 640 }}>
      {lines.map((line, i) => (
        <Text key={i} style={[Typography.prayerBody, { color: colors.ink, fontFamily, marginBottom: Spacing.sm }]}>
          {line}
        </Text>
      ))}
    </View>
  );
}

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function PrimaryButton({ label, onPress, disabled = false }: PrimaryButtonProps) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={{
        backgroundColor: disabled ? colors.stone : colors.candle,
        borderRadius: Radii.pill,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
        marginVertical: Spacing.sm,
      }}
    >
      <Text style={[Typography.button, { color: colors.ink, fontFamily: 'Inter_600SemiBold' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface TextButtonProps {
  label: string;
  onPress: () => void;
}

export function TextButton({ label, onPress }: TextButtonProps) {
  const colors = useColors();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ alignItems: 'center', padding: Spacing.sm }}>
      <Text style={[Typography.body, { color: colors.stone, textDecorationLine: 'underline' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface FeedbackTapProps {
  onHelpful: () => void;
  onNotHelpful: () => void;
  selected?: 'helpful' | 'not_helpful' | null;
}

export function FeedbackTap({ onHelpful, onNotHelpful, selected }: FeedbackTapProps) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: 'row', gap: Spacing.base, justifyContent: 'center', marginTop: Spacing.xl }}>
      <TouchableOpacity
        onPress={onHelpful}
        style={{
          borderWidth: 1,
          borderColor: selected === 'helpful' ? colors.helpful : colors.hairline,
          borderRadius: Radii.pill,
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.sm,
          backgroundColor: selected === 'helpful' ? colors.helpful + '22' : 'transparent',
        }}
      >
        <Text style={[Typography.caption, { color: selected === 'helpful' ? colors.helpful : colors.stone }]}>
          Me ayudó
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onNotHelpful}
        style={{
          borderWidth: 1,
          borderColor: selected === 'not_helpful' ? colors.notHelpful : colors.hairline,
          borderRadius: Radii.pill,
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.sm,
          backgroundColor: selected === 'not_helpful' ? colors.notHelpful + '22' : 'transparent',
        }}
      >
        <Text style={[Typography.caption, { color: selected === 'not_helpful' ? colors.notHelpful : colors.stone }]}>
          No me ayudó
        </Text>
      </TouchableOpacity>
    </View>
  );
}

interface PriestPointerProps {
  tradition: 'catholic' | 'orthodox' | 'neither';
}

export function PriestPointer({ tradition }: PriestPointerProps) {
  const colors = useColors();
  const text = tradition === 'orthodox'
    ? 'Un padre espiritual puede acompañarte a vivir lo que esta oración nombra. Búscalo cuando estés listo.'
    : 'Un sacerdote puede acompañarte a vivir lo que esta oración nombra. Búscalo cuando estés listo.';
  return (
    <Text style={[Typography.caption, { color: colors.stone, fontStyle: 'italic', marginTop: Spacing.xl, textAlign: 'center' }]}>
      {text}
    </Text>
  );
}

interface BlurVeilProps {
  ctaLabel: string;
  onCta: () => void;
}

export function BlurVeil({ ctaLabel, onCta }: BlurVeilProps) {
  const colors = useColors();
  const { width } = Dimensions.get('window');
  return (
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 220 }}>
      <BlurView intensity={35} tint="light" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.veil, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl }]}>
        <Text style={[Typography.body, { color: colors.ink, textAlign: 'center', marginBottom: Spacing.base }]}>
          Esta oración fue escrita para ti.
        </Text>
        <PrimaryButton label={ctaLabel} onPress={onCta} />
      </View>
    </View>
  );
}

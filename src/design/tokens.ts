export const Colors = {
  light: {
    parchment: '#F4EEE2',
    surface: '#FBF7EE',
    ink: '#2B2521',
    stone: '#6B635A',
    hairline: '#E0D8C8',
    candle: '#C9A24B',
    candleDk: '#A6822F',
    ember: '#8C3B2E',
    helpful: '#4F7A52',
    notHelpful: '#9A7B3F',
    veil: 'rgba(244,238,226,0.72)',
    white: '#FFFFFF',
  },
  dark: {
    parchment: '#1B1714',
    surface: '#241F1A',
    ink: '#EDE6D8',
    stone: '#A89E90',
    hairline: '#342D26',
    candle: '#D4AF5A',
    candleDk: '#B89040',
    ember: '#B4513E',
    helpful: '#4F7A52',
    notHelpful: '#9A7B3F',
    veil: 'rgba(27,23,20,0.72)',
    white: '#FFFFFF',
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const Radii = {
  sm: 8,
  md: 14,
  lg: 24,
  pill: 999,
} as const;

export const Typography = {
  prayerLead: { fontSize: 22, lineHeight: 34, fontWeight: '500' as const },
  prayerBody: { fontSize: 20, lineHeight: 32, fontWeight: '500' as const },
  question: { fontSize: 26, lineHeight: 34, fontWeight: '500' as const },
  screenTitle: { fontSize: 20, lineHeight: 28, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  button: { fontSize: 16, lineHeight: 22, fontWeight: '600' as const, letterSpacing: 0.3 },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
} as const;

export const Motion = {
  fast: 300,
  medium: 450,
  slow: 600,
} as const;

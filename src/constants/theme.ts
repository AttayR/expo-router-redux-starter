/**
 * Colors for light and dark mode. Swap these for your brand, or replace this
 * file with a styling library (NativeWind, Tamagui, Unistyles, ...).
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#60646C',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    border: '#D9D9E0',
    tint: '#2563EB',
    onTint: '#ffffff',
    danger: '#DC2626',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#B0B4BA',
    background: '#0B0B0D',
    backgroundElement: '#1C1D20',
    backgroundSelected: '#2E3135',
    border: '#33363B',
    tint: '#60A5FA',
    onTint: '#0B0B0D',
    danger: '#F87171',
  },
} as const;

export type ColorScheme = keyof typeof Colors;
export type ThemeColor = keyof typeof Colors.light;

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', mono: 'ui-monospace' },
  default: { sans: 'normal', mono: 'monospace' },
  web: { sans: 'var(--font-display)', mono: 'var(--font-mono)' },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
} as const;

export const MaxContentWidth = 800;

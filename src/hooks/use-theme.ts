import { useColorScheme } from 'react-native';

import { Colors, type ColorScheme } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';
import { selectThemePreference } from '@/store/settings-slice';

/** The active color scheme: the user's choice, or the device setting for "system". */
export function useColorSchemeName(): ColorScheme {
  const preference = useAppSelector(selectThemePreference);
  const device = useColorScheme();
  if (preference !== 'system') return preference;
  return device === 'dark' ? 'dark' : 'light';
}

export function useTheme() {
  return Colors[useColorSchemeName()];
}

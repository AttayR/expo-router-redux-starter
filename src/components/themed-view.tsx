import { View, type ViewProps } from 'react-native';

import type { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedViewProps = ViewProps & {
  /** Background color from the theme. Defaults to `background`. */
  type?: ThemeColor;
};

export function ThemedView({ style, type = 'background', ...rest }: ThemedViewProps) {
  const theme = useTheme();
  return <View style={[{ backgroundColor: theme[type] }, style]} {...rest} />;
}

import { StyleSheet, Text, type TextProps } from 'react-native';

import type { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'subtitle' | 'small' | 'smallBold';
  /** Text color from the theme. Defaults to `text`. */
  themeColor?: ThemeColor;
};

export function ThemedText({
  style,
  type = 'default',
  themeColor = 'text',
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();
  return <Text style={[{ color: theme[themeColor] }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
  title: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
  subtitle: { fontSize: 20, lineHeight: 28, fontWeight: '600' },
  small: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  smallBold: { fontSize: 14, lineHeight: 20, fontWeight: '700' },
});

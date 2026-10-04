import { ScrollView, StyleSheet, View } from 'react-native';

import { SegmentedControl } from '@/components/segmented-control';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/i18n';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  languageChanged,
  selectLanguagePreference,
  selectThemePreference,
  themeChanged,
  type LanguagePreference,
  type ThemePreference,
} from '@/store/settings-slice';

const THEMES: readonly ThemePreference[] = ['system', 'light', 'dark'];
const LANGUAGES: readonly LanguagePreference[] = ['system', 'en', 'es'];

export default function SettingsScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectThemePreference);
  const language = useAppSelector(selectLanguagePreference);

  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            {t('settings.appearance')}
          </ThemedText>
          <SegmentedControl
            accessibilityLabel={t('settings.appearance')}
            value={theme}
            onChange={(value) => dispatch(themeChanged(value))}
            options={THEMES.map((value) => ({ value, label: t(`settings.theme.${value}`) }))}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            {t('settings.language')}
          </ThemedText>
          <SegmentedControl
            accessibilityLabel={t('settings.language')}
            value={language}
            onChange={(value) => dispatch(languageChanged(value))}
            options={LANGUAGES.map((value) => ({ value, label: t(`settings.languages.${value}`) }))}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: Spacing.four, gap: Spacing.five },
  section: { gap: Spacing.two },
});

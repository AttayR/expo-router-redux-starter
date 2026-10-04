import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/i18n';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: '' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle">{t('notFound.title')}</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText themeColor="tint">{t('notFound.goHome')}</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.four },
  link: { marginTop: Spacing.three, paddingVertical: Spacing.three },
});

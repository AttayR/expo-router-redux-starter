import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/i18n';

import { Button } from './button';
import { ThemedText } from './themed-text';

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

/** Full-screen error with an optional retry button. */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <ThemedText themeColor="textSecondary" style={styles.message}>
        {message ?? t('common.somethingWentWrong')}
      </ThemedText>
      {onRetry && <Button title={t('common.retry')} variant="secondary" onPress={onRetry} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
  message: { textAlign: 'center' },
});

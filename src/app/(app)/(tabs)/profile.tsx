import { Image } from 'expo-image';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ErrorState } from '@/components/error-state';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n';
import { useMeQuery } from '@/services/api';
import { signOut } from '@/store';
import { useAppDispatch } from '@/store/hooks';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { data: user, isLoading, isError, refetch } = useMeQuery();

  return (
    <ThemedView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator color={theme.tint} style={styles.flex} />
      ) : isError || !user ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <View style={styles.card}>
          <Image
            source={user.image}
            style={[styles.avatar, { backgroundColor: theme.backgroundElement }]}
            accessibilityIgnoresInvertColors
          />
          <ThemedText type="subtitle">
            {user.firstName} {user.lastName}
          </ThemedText>
          <ThemedText themeColor="textSecondary">@{user.username}</ThemedText>
          <ThemedText themeColor="textSecondary">{user.email}</ThemedText>
        </View>
      )}
      <Button title={t('profile.signOut')} variant="danger" onPress={() => dispatch(signOut())} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: Spacing.four, gap: Spacing.four },
  card: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.one },
  avatar: { width: 112, height: 112, borderRadius: Radius.full, marginBottom: Spacing.three },
});

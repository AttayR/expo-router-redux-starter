import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { ErrorState } from '@/components/error-state';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n';
import { useProductQuery } from '@/services/api';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const { data: product, isLoading, isError, refetch } = useProductQuery(Number(id));

  if (isLoading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator color={theme.tint} />
      </ThemedView>
    );
  }

  if (isError || !product) {
    return (
      <ThemedView style={styles.flex}>
        <ErrorState onRetry={refetch} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.flex}>
      <Stack.Screen options={{ title: product.title }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={product.images[0] ?? product.thumbnail}
          style={[styles.image, { backgroundColor: theme.backgroundElement }]}
          contentFit="contain"
          transition={200}
        />
        <View style={styles.section}>
          <ThemedText type="subtitle">{product.title}</ThemedText>
          <ThemedText themeColor="textSecondary">{product.brand ?? product.category}</ThemedText>
        </View>
        <View style={styles.meta}>
          <ThemedText type="subtitle" themeColor="tint">
            ${product.price.toFixed(2)}
          </ThemedText>
          <ThemedText themeColor="textSecondary">
            {t('products.rating', { rating: product.rating.toFixed(1) })}
          </ThemedText>
        </View>
        <ThemedText>{product.description}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {t('products.inStock', { count: product.stock })}
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: {
    gap: Spacing.three,
    padding: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  image: { width: '100%', aspectRatio: 1, borderRadius: Radius.lg },
  section: { gap: Spacing.one },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

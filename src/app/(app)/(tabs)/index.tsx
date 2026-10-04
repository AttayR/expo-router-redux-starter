import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

import { ErrorState } from '@/components/error-state';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n';
import { PAGE_SIZE, useProductsQuery } from '@/services/api';
import type { ProductSummary } from '@/services/types';

export default function ProductsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [skip, setSkip] = useState(0);
  const { data, isLoading, isFetching, isError, refetch } = useProductsQuery({ skip });

  const products = data?.products ?? [];
  const hasMore = data ? products.length < data.total : false;

  const loadMore = () => {
    if (!isFetching && hasMore) setSkip(products.length);
  };

  const refresh = () => {
    if (skip === 0) refetch();
    else setSkip(0);
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator color={theme.tint} />
      </ThemedView>
    );
  }

  if (isError && products.length === 0) {
    return (
      <ThemedView style={styles.flex}>
        <ErrorState onRetry={refetch} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.flex}>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ProductRow product={item} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.two }} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={PAGE_SIZE}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && skip === 0 && !isLoading}
            onRefresh={refresh}
            tintColor={theme.tint}
          />
        }
        ListEmptyComponent={
          <ThemedText themeColor="textSecondary" style={styles.empty}>
            {t('products.empty')}
          </ThemedText>
        }
        ListFooterComponent={
          isFetching && skip > 0 ? (
            <ActivityIndicator style={styles.footer} color={theme.tint} />
          ) : null
        }
      />
    </ThemedView>
  );
}

function ProductRow({ product }: { product: ProductSummary }) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Link href={{ pathname: '/product/[id]', params: { id: product.id } }} asChild>
      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.row,
          { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.85 : 1 },
        ]}>
        <Image
          source={product.thumbnail}
          style={styles.thumbnail}
          contentFit="cover"
          transition={150}
        />
        <View style={styles.rowText}>
          <ThemedText numberOfLines={1}>{product.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
            {product.brand ?? product.category}
          </ThemedText>
          <View style={styles.meta}>
            <ThemedText type="smallBold" themeColor="tint">
              ${product.price.toFixed(2)}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {t('products.rating', { rating: product.rating.toFixed(1) })}
            </ThemedText>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.three },
  row: { flexDirection: 'row', gap: Spacing.three, padding: Spacing.two, borderRadius: Radius.lg },
  thumbnail: { width: 72, height: 72, borderRadius: Radius.md },
  rowText: { flex: 1, justifyContent: 'center', gap: Spacing.half },
  meta: { flexDirection: 'row', justifyContent: 'space-between' },
  empty: { textAlign: 'center', marginTop: Spacing.six },
  footer: { marginVertical: Spacing.three },
});

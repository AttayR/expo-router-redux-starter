import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTranslation } from '@/i18n';
import { useLoginMutation } from '@/services/api';

/** Public demo account from https://dummyjson.com/docs/auth */
const DEMO = { username: 'emilys', password: 'emilyspass' };

export default function SignInScreen() {
  const { t } = useTranslation();
  const [login, { isLoading, isError }] = useLoginMutation();
  const [username, setUsername] = useState(DEMO.username);
  const [password, setPassword] = useState(DEMO.password);

  // On success the login mutation stores the tokens, and the root layout's
  // Stack.Protected guard switches to the signed-in screens automatically.
  const onSubmit = () => {
    login({ username: username.trim(), password }).catch(() => {});
  };

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <ThemedText type="title">{t('signIn.title')}</ThemedText>
              <ThemedText themeColor="textSecondary">{t('signIn.subtitle')}</ThemedText>
            </View>

            <TextField
              label={t('signIn.username')}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              textContentType="username"
              returnKeyType="next"
            />
            <TextField
              label={t('signIn.password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={onSubmit}
            />

            {isError && (
              <ThemedText type="small" themeColor="danger" accessibilityRole="alert">
                {t('signIn.invalidCredentials')}
              </ThemedText>
            )}

            <Button
              title={t('signIn.submit')}
              onPress={onSubmit}
              loading={isLoading}
              disabled={!username.trim() || !password}
            />

            <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
              {t('signIn.demoHint', DEMO)}
            </ThemedText>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth / 2,
    alignSelf: 'center',
  },
  header: { gap: Spacing.one, marginBottom: Spacing.three },
  hint: { textAlign: 'center' },
});

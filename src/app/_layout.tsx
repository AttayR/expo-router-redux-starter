import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { Colors } from '@/constants/theme';
import { useColorSchemeName } from '@/hooks/use-theme';
import { persistor, store } from '@/store/store';
import { selectIsSignedIn } from '@/store/auth-slice';
import { useAppSelector } from '@/store/hooks';

// Keep the splash screen up until the persisted tokens have been read.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} onBeforeLift={() => SplashScreen.hideAsync()}>
        <RootNavigator />
      </PersistGate>
    </Provider>
  );
}

function RootNavigator() {
  const isSignedIn = useAppSelector(selectIsSignedIn);
  const scheme = useColorSchemeName();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const colors = Colors[scheme];

  return (
    <ThemeProvider
      value={{
        ...base,
        colors: {
          ...base.colors,
          primary: colors.tint,
          background: colors.background,
          card: colors.background,
        },
      }}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Signed-in users can only reach (app); signed-out users only sign-in. */}
        <Stack.Protected guard={isSignedIn}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="sign-in" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}

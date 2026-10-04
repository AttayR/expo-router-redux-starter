import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { Storage } from 'redux-persist';

/** SecureStore keys may only contain letters, digits, ".", "-" and "_". */
const toSecureKey = (key: string) => key.replace(/[^a-zA-Z0-9._-]/g, '_');

/**
 * redux-persist storage backed by the iOS Keychain / Android Keystore.
 * Use it for tokens only: SecureStore values should stay under ~2 KB.
 * Web has no secure store, so it falls back to AsyncStorage (localStorage).
 */
export const secureStorage: Storage =
  Platform.OS === 'web'
    ? AsyncStorage
    : {
        getItem: (key) => SecureStore.getItemAsync(toSecureKey(key)),
        setItem: (key, value: string) => SecureStore.setItemAsync(toSecureKey(key), value),
        removeItem: (key) => SecureStore.deleteItemAsync(toSecureKey(key)),
      };

/** Plain storage for non-sensitive preferences. */
export const appStorage: Storage = AsyncStorage;

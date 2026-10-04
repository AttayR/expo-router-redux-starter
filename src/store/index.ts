import {
  combineReducers,
  configureStore,
  type ThunkAction,
  type UnknownAction,
} from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

import { apiSlice } from '@/services/api';

import { authSlice, signedOut } from './auth-slice';
import { settingsSlice } from './settings-slice';
import { appStorage, secureStorage } from './storage';

const rootReducer = combineReducers({
  // Tokens live in the Keychain / Keystore.
  [authSlice.reducerPath]: persistReducer(
    { key: 'auth', storage: secureStorage },
    authSlice.reducer
  ),
  // Preferences are not sensitive.
  [settingsSlice.reducerPath]: persistReducer(
    { key: 'settings', storage: appStorage },
    settingsSlice.reducer
  ),
  // Server cache is never persisted; RTK Query refetches it.
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export function makeStore(preloadedState?: Partial<ReturnType<typeof rootReducer>>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefault) =>
      getDefault({
        serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
      }).concat(apiSlice.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<R = void> = ThunkAction<R, RootState, unknown, UnknownAction>;

/** Clears the tokens and every cached server response. */
export const signOut = (): AppThunk => (dispatch) => {
  dispatch(signedOut());
  dispatch(apiSlice.util.resetApiState());
};

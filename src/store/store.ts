import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore } from 'redux-persist';

import { makeStore } from './index';

/** The app's single store. Tests create their own with `makeStore()`. */
export const store = makeStore();
export const persistor = persistStore(store);

// Refetch on reconnect / app focus.
setupListeners(store.dispatch);

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    tokensReceived(state, action: PayloadAction<Tokens>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    signedOut() {
      return initialState;
    },
  },
  selectors: {
    selectAccessToken: (state) => state.accessToken,
    selectRefreshToken: (state) => state.refreshToken,
    selectIsSignedIn: (state) => state.accessToken !== null,
  },
});

export const { tokensReceived, signedOut } = authSlice.actions;
export const { selectAccessToken, selectRefreshToken, selectIsSignedIn } = authSlice.selectors;

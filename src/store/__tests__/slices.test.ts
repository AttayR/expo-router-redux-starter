import { authSlice, selectIsSignedIn, signedOut, tokensReceived } from '../auth-slice';
import { languageChanged, settingsSlice, themeChanged } from '../settings-slice';

describe('authSlice', () => {
  const tokens = { accessToken: 'access', refreshToken: 'refresh' };

  it('starts signed out', () => {
    const state = authSlice.reducer(undefined, { type: 'init' });
    expect(selectIsSignedIn({ auth: state })).toBe(false);
  });

  it('stores tokens and signs in', () => {
    const state = authSlice.reducer(undefined, tokensReceived(tokens));
    expect(state).toEqual(tokens);
    expect(selectIsSignedIn({ auth: state })).toBe(true);
  });

  it('clears tokens on sign out', () => {
    const signedIn = authSlice.reducer(undefined, tokensReceived(tokens));
    const state = authSlice.reducer(signedIn, signedOut());
    expect(state).toEqual({ accessToken: null, refreshToken: null });
  });
});

describe('settingsSlice', () => {
  it('defaults to the system theme and language', () => {
    expect(settingsSlice.reducer(undefined, { type: 'init' })).toEqual({
      theme: 'system',
      language: 'system',
    });
  });

  it('updates theme and language', () => {
    let state = settingsSlice.reducer(undefined, themeChanged('dark'));
    state = settingsSlice.reducer(state, languageChanged('es'));
    expect(state).toEqual({ theme: 'dark', language: 'es' });
  });
});

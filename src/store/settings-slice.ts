import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ThemePreference = 'system' | 'light' | 'dark';
export type LanguagePreference = 'system' | 'en' | 'es';

export type SettingsState = {
  theme: ThemePreference;
  language: LanguagePreference;
};

const initialState: SettingsState = {
  theme: 'system',
  language: 'system',
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    themeChanged(state, action: PayloadAction<ThemePreference>) {
      state.theme = action.payload;
    },
    languageChanged(state, action: PayloadAction<LanguagePreference>) {
      state.language = action.payload;
    },
  },
  selectors: {
    selectThemePreference: (state) => state.theme,
    selectLanguagePreference: (state) => state.language,
  },
});

export const { themeChanged, languageChanged } = settingsSlice.actions;
export const { selectThemePreference, selectLanguagePreference } = settingsSlice.selectors;

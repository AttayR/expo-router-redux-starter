import { getLocales } from 'expo-localization';

import { i18n, resolveLocale } from '../index';

jest.mock('expo-localization', () => ({ getLocales: jest.fn() }));

const mockDeviceLanguage = (languageCode: string | null) =>
  (getLocales as jest.Mock).mockReturnValue([{ languageCode }]);

describe('resolveLocale', () => {
  it('uses an explicit preference', () => {
    mockDeviceLanguage('es');
    expect(resolveLocale('en')).toBe('en');
  });

  it('follows a supported device language', () => {
    mockDeviceLanguage('es');
    expect(resolveLocale('system')).toBe('es');
  });

  it('falls back to English for unsupported device languages', () => {
    mockDeviceLanguage('ur');
    expect(resolveLocale('system')).toBe('en');
    mockDeviceLanguage(null);
    expect(resolveLocale('system')).toBe('en');
  });
});

describe('translations', () => {
  it('interpolates values', () => {
    expect(i18n.t('signIn.demoHint', { locale: 'es', username: 'a', password: 'b' })).toBe(
      'Cuenta de prueba: a / b'
    );
  });
});

# Expo Router Redux Starter

[![CI](https://github.com/AttayR/expo-router-redux-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/AttayR/expo-router-redux-starter/actions/workflows/ci.yml)
![Expo SDK](https://img.shields.io/badge/Expo%20SDK-57-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A production-ready starting point for React Native apps with **Expo Router**,
**Redux Toolkit** and **RTK Query**. Sign-in, protected routes, secure token
storage with automatic refresh, dark mode, translations, tests and CI are
already wired up, so you can start on your own screens on day one.

It runs out of the box against the free [DummyJSON](https://dummyjson.com) API.

## ✨ What's inside

|                      |                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 🧭 **Expo Router**   | File-based navigation with `Stack.Protected` auth guards and typed routes                                                                  |
| 🗃️ **Redux Toolkit** | Typed store, hooks and slices with `createSlice` selectors                                                                                 |
| 🔌 **RTK Query**     | Data fetching and caching, plus an infinite-scroll list example                                                                            |
| 🔐 **Auth**          | Login, tokens kept in the Keychain / Keystore (`expo-secure-store`), **automatic token refresh on 401** and sign-out that clears the cache |
| 💾 **Persistence**   | `redux-persist`: tokens in secure storage, preferences in AsyncStorage                                                                     |
| 🌗 **Theming**       | Light / dark / system, chosen in Settings and remembered                                                                                   |
| 🌍 **i18n**          | `i18n-js` + `expo-localization`, English and Spanish, with **type-checked translation keys**                                               |
| ✅ **Quality**       | Strict TypeScript, ESLint, Prettier, Jest tests and a GitHub Actions CI workflow                                                           |
| 🚀 **EAS**           | `eas.json` with development, preview and production profiles                                                                               |

## 🚀 Quick start

```bash
git clone https://github.com/AttayR/expo-router-redux-starter.git my-app
cd my-app
npm install
npx expo start
```

Then press `i` (iOS simulator), `a` (Android emulator) or `w` (web), or scan
the QR code with [Expo Go](https://expo.dev/go).

Sign in with the DummyJSON demo account, already filled in for you:
**`emilys` / `emilyspass`**.

## 🗂️ Project structure

```
src/
  app/                  Routes (Expo Router)
    _layout.tsx           Providers + Stack.Protected auth guard
    sign-in.tsx           Public sign-in screen
    (app)/                Signed-in area
      (tabs)/               Products, Profile, Settings
      product/[id].tsx      Product details
  components/           Themed UI: Button, TextField, SegmentedControl, ...
  config/env.ts         Runtime config from EXPO_PUBLIC_* variables
  constants/theme.ts    Colors, spacing and radii for light and dark mode
  hooks/use-theme.ts    Resolves the active color scheme
  i18n/                 Translations and the typed useTranslation() hook
  services/api.ts       RTK Query API with token refresh
  store/                Store factory, slices, typed hooks, storage adapters
```

## 🔐 How auth works

```
sign in ──► POST /auth/login ──► tokensReceived ──► Stack.Protected shows (app)
                                     │
                                     ▼
                      tokens persisted in SecureStore

any request ──► 401? ──► POST /auth/refresh ──► retry with the new token
                              │
                              └─ refresh fails ──► sign out + clear cache
```

- The root layout renders `(app)` only when there's an access token, and
  `sign-in` only when there isn't. There's no manual redirect logic.
- Parallel requests that hit a 401 share **one** refresh call.
- `PersistGate` keeps the splash screen up until the saved tokens are read, so
  signed-in users never see a flash of the sign-in screen.

## 🔧 Make it yours

**Point it at your API.** Copy `.env.example` to `.env` and set
`EXPO_PUBLIC_API_URL`. Then edit the endpoints in `src/services/api.ts` and the
response types in `src/services/types.ts`. If your refresh endpoint differs,
update the `/auth/refresh` call in `baseQueryWithReauth`.

**Rename the app.** Change `name`, `slug` and `scheme` in `app.json`, and add
`ios.bundleIdentifier` / `android.package` before your first store build.

**Add a language.** Create `src/i18n/fr.ts` typed as `Translations` (TypeScript
reports any missing key), register it in `src/i18n/index.ts` and add it to the
options in the Settings screen.

**Change the look.** Edit the colors in `src/constants/theme.ts`, or swap in
NativeWind, Tamagui or Unistyles.

## 📜 Scripts

| Command                           | What it does                  |
| --------------------------------- | ----------------------------- |
| `npm start`                       | Start the Expo dev server     |
| `npm run ios` / `android` / `web` | Start on a specific platform  |
| `npm run lint`                    | ESLint (`eslint-config-expo`) |
| `npm run typecheck`               | `tsc --noEmit`                |
| `npm test`                        | Jest (`jest-expo`)            |
| `npm run format`                  | Format with Prettier          |

## ✅ Tests

Tests live next to the code in `__tests__` folders:

- `store/__tests__`: auth and settings reducers and selectors
- `services/__tests__`: sending the token, **refreshing on 401 and retrying**,
  signing out when the refresh fails, and storing tokens after login
- `i18n/__tests__`: locale resolution and interpolation

CI runs lint, typecheck, Prettier, the tests and `expo-doctor` on every push and
pull request.

## 📦 Building with EAS

```bash
npm i -g eas-cli
eas login
eas build --profile development   # dev client
eas build --profile production    # store builds
eas submit --profile production
```

Keep signing keys and store credentials in EAS. `.gitignore` already blocks
keystores, `.p8`/`.p12` files and `.env`.

## 🤝 Contributing

Issues and pull requests are welcome. Please run `npm run lint`,
`npm run typecheck` and `npm test` before opening a PR.

If this starter saved you time, consider giving it a ⭐. It helps others find it.

## 📄 License

[MIT](LICENSE) © Attay Rasool

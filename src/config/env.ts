/**
 * Runtime configuration. Only `EXPO_PUBLIC_*` variables reach the app bundle,
 * so never put secrets here. See `.env.example`.
 */
export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://dummyjson.com',
} as const;

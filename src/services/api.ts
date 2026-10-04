import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { env } from '@/config/env';
import {
  selectAccessToken,
  selectRefreshToken,
  signedOut,
  tokensReceived,
  type AuthState,
  type Tokens,
} from '@/store/auth-slice';

import type { LoginRequest, LoginResponse, Product, ProductPage, User } from './types';

/** Typed as `{ auth }` instead of RootState to avoid a store <-> api import cycle. */
type StateWithAuth = { auth: AuthState };

export const PAGE_SIZE = 20;
const TOKEN_LIFETIME_MINUTES = 30;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.apiUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = selectAccessToken(getState() as StateWithAuth);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

/** Shared so parallel 401s trigger a single refresh request. */
let refreshInFlight: Promise<boolean> | null = null;

/**
 * Retries a request once after refreshing the access token on 401.
 * If the refresh fails, the user is signed out.
 */
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status !== 401) return result;

  const refreshToken = selectRefreshToken(api.getState() as StateWithAuth);
  if (!refreshToken) return result;

  refreshInFlight ??= (async () => {
    const refresh = await rawBaseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken, expiresInMins: TOKEN_LIFETIME_MINUTES },
      },
      api,
      extraOptions
    );
    if (refresh.data) {
      api.dispatch(tokensReceived(refresh.data as Tokens));
      return true;
    }
    api.dispatch(signedOut());
    api.dispatch(apiSlice.util.resetApiState());
    return false;
  })().finally(() => {
    refreshInFlight = null;
  });

  if (await refreshInFlight) {
    result = await rawBaseQuery(args, api, extraOptions);
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Me', 'Product'],
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: { ...credentials, expiresInMins: TOKEN_LIFETIME_MINUTES },
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(
          tokensReceived({ accessToken: data.accessToken, refreshToken: data.refreshToken })
        );
      },
    }),

    me: build.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['Me'],
    }),

    /** Infinite list: pages are merged into one cache entry keyed without `skip`. */
    products: build.query<ProductPage, { skip: number }>({
      query: ({ skip }) => ({
        url: '/products',
        params: { limit: PAGE_SIZE, skip, select: 'title,price,thumbnail,rating,brand,category' },
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (cache, page, { arg }) => {
        if (arg.skip === 0) return page;
        const seen = new Set(cache.products.map((p) => p.id));
        cache.products.push(...page.products.filter((p) => !seen.has(p.id)));
        cache.skip = page.skip;
        cache.total = page.total;
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.skip !== previousArg?.skip,
      providesTags: ['Product'],
    }),

    product: build.query<Product, number>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
  }),
});

export const { useLoginMutation, useMeQuery, useProductsQuery, useProductQuery } = apiSlice;

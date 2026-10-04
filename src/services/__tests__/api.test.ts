import { makeStore, type AppStore } from '@/store';

import { apiSlice } from '../api';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const user = {
  id: 1,
  username: 'emilys',
  email: 'e@x.com',
  firstName: 'E',
  lastName: 'S',
  image: '',
};

const urlOf = (input: unknown) => (input instanceof Request ? input.url : String(input));
const authHeaderOf = (input: unknown) =>
  input instanceof Request ? input.headers.get('Authorization') : null;

describe('api', () => {
  const fetchMock = jest.fn();
  let store: AppStore;

  const signIn = () =>
    makeStore({
      auth: {
        accessToken: 'old-access',
        refreshToken: 'old-refresh',
        _persist: { version: -1, rehydrated: true },
      },
    });

  // RTK Query schedules cache and subscription-sync timers; fake timers let us
  // flush them so nothing runs after the test environment is torn down.
  beforeEach(() => {
    jest.useFakeTimers();
    fetchMock.mockReset();
    globalThis.fetch = fetchMock;
  });

  afterEach(() => {
    store?.dispatch(apiSlice.util.resetApiState());
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('sends the access token', async () => {
    fetchMock.mockResolvedValueOnce(json(200, user));
    store = signIn();

    await store.dispatch(apiSlice.endpoints.me.initiate());

    expect(authHeaderOf(fetchMock.mock.calls[0][0])).toBe('Bearer old-access');
  });

  it('refreshes the token on 401 and retries the request', async () => {
    fetchMock
      .mockResolvedValueOnce(json(401, { message: 'Token Expired!' }))
      .mockResolvedValueOnce(json(200, { accessToken: 'new-access', refreshToken: 'new-refresh' }))
      .mockResolvedValueOnce(json(200, user));
    store = signIn();

    const result = await store.dispatch(apiSlice.endpoints.me.initiate());

    expect(result.data).toEqual(user);
    expect(urlOf(fetchMock.mock.calls[1][0])).toContain('/auth/refresh');
    expect(authHeaderOf(fetchMock.mock.calls[2][0])).toBe('Bearer new-access');
    expect(store.getState().auth).toMatchObject({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    });
  });

  it('signs out without retrying when the refresh fails', async () => {
    fetchMock
      .mockResolvedValueOnce(json(401, { message: 'Token Expired!' }))
      .mockResolvedValueOnce(json(403, { message: 'Invalid refresh token' }));
    store = signIn();

    await store.dispatch(apiSlice.endpoints.me.initiate());

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(store.getState().auth).toMatchObject({ accessToken: null, refreshToken: null });
  });

  it('stores the tokens after login', async () => {
    fetchMock.mockResolvedValueOnce(json(200, { ...user, accessToken: 'a', refreshToken: 'r' }));
    store = makeStore();

    await store.dispatch(apiSlice.endpoints.login.initiate({ username: 'emilys', password: 'x' }));

    expect(store.getState().auth).toMatchObject({ accessToken: 'a', refreshToken: 'r' });
  });
});

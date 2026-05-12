import enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import '@testing-library/jest-dom';
import { RequestHandler } from 'msw';
import { server } from './test/msw-server';

// MSW v2 expects request.signal to exist when a handler runs, but some request
// sources in our tests may omit it after dependency updates.
const originalRequestHandlerRun = Object.getOwnPropertyDescriptor(
  RequestHandler.prototype,
  'run',
)?.value as typeof RequestHandler.prototype.run | undefined;

if (!originalRequestHandlerRun) {
  throw new Error('MSW RequestHandler.run is unavailable in test setup');
}

RequestHandler.prototype.run = function patchedRequestHandlerRun(args) {
  const request = (args as { request?: { signal?: AbortSignal } }).request;

  if (request && !request.signal) {
    try {
      Object.defineProperty(request, 'signal', {
        configurable: true,
        value: new AbortController().signal,
      });
    } catch {
      // Best effort only: if request is not extensible, keep original behavior.
    }
  }

  return originalRequestHandlerRun.call(this, args as any);
};

// ---------------------------------------------------------------------------
// MSW server lifecycle — intercepts tRPC HTTP calls for hook tests that use
// renderHook with the real tRPC client. Enzyme-based component tests that
// vi.mock the tRPC client locally are unaffected (no real HTTP calls made).
// ---------------------------------------------------------------------------
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// NOTE: The global vi.mock for './src/api/trpc/client' has been removed.
// Hook tests now use the REAL tRPC client + MSW handlers per-test.
// Legacy enzyme shallow tests that can't mount providers keep local in-file
// vi.mock('./src/api/trpc/client', ...) stubs.

vi.mock('@testing-library/react-hooks', async () => {
  const actual = (await import('@testing-library/react-hooks/dom')) as any;
  const React = await import('react');
  const { QueryClient, QueryClientProvider } = await import('@tanstack/react-query');
  const { httpLink } = await import('@trpc/client');
  // Real tRPC client — HTTP requests are intercepted by MSW in hook tests.
  const { trpcClient } = await import('./src/api');

  const renderHook = (callback, options = {}) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
        queries: { retry: false },
      },
    });
    // Use non-batched HTTP in tests so msw-trpc route handlers match exactly.
    const trpcHttpClient = trpcClient.createClient({
      links: [
        httpLink({
          methodOverride: 'POST',
          url: `${window.location.origin}/trpc`,
        }),
      ],
    });

    const BaseWrapper = ({ children }) =>
      React.createElement(
        trpcClient.Provider as any,
        { client: trpcHttpClient, queryClient },
        React.createElement(QueryClientProvider, { client: queryClient }, children),
      );

    const userWrapper = (options as { wrapper?: React.ComponentType<any> }).wrapper;

    const wrapper = userWrapper
      ? ({ children }) =>
          React.createElement(
            BaseWrapper,
            null,
            React.createElement(userWrapper, null, children),
          )
      : BaseWrapper;

    return actual.renderHook(callback, {
      ...(options as Record<string, unknown>),
      wrapper,
    });
  };

  return {
    ...actual,
    renderHook,
  };
});

// Polyfill setImmediate for jsdom (missing in newer Node.js)
if (typeof globalThis.setImmediate === 'undefined') {
  (globalThis as any).setImmediate = (
    fn: (...args: unknown[]) => void,
    ...args: unknown[]
  ) => setTimeout(fn, 0, ...args);
}

//! uncomment this will cause problem with vitest mocks
// const { toMatchScreenshots } = require('./src/to-match-screenshots');
// expect.extend({ toMatchScreenshots });

expect.extend({ toMatchImageSnapshot });

// Re-enable jest-fetch-mock so that tests importing 'jest-fetch-mock' directly
// (e.g. fetch.mockResponseOnce) keep working. The jest global shim in
// setupTests.vitest-globals.ts ensures jest.fn() is available when the module
// initialises. vi.stubGlobal is kept as fallback comment only.
const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();
// Keep the native fetch implementation active so MSW can intercept Request objects.
fetchMock.dontMock();

enzyme.configure({ adapter: new Adapter() });

import { createTRPCMsw, httpLink } from 'msw-trpc';
import type { AppRouter } from '../src/api/trpc/router';

const trpcBaseUrl =
  typeof window !== 'undefined' && window.location?.origin
    ? `${window.location.origin}/__storybook_playwright/trpc`
    : 'http://localhost/__storybook_playwright/trpc';

/**
 * Typed MSW tRPC handler factory.
 *
 * Usage in tests:
 *   import { server } from '../msw-server';
 *   import { trpcMsw } from '../trpc-msw';
 *
 *   server.use(
 *     trpcMsw.screenshot.saveScreenshot.mutation(() => ({ added: true })),
 *   );
 *
 * The procedure name is validated at compile time against AppRouter — if a
 * route or procedure is renamed the TypeScript error surfaces here rather than
 * silently breaking tests at runtime.
 */
export const trpcMsw = createTRPCMsw<AppRouter>({
  links: [httpLink({ methodOverride: 'POST', url: trpcBaseUrl })],
});

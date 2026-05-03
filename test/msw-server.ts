import { setupServer } from 'msw/node';

/**
 * Shared MSW server instance used by all hook tests.
 * Lifecycle hooks (beforeAll/afterEach/afterAll) are registered in setupTests.ts.
 */
export const server = setupServer();

/**
 * Vitest global compatibility setup.
 * Exposes 'vi' as the global 'jest' object so that legacy code using jest.fn(),
 * jest.spyOn(), jest.clearAllMocks(), etc. continues to work without file changes.
 * This runs as a setupFile, which executes after vitest's globals (including vi)
 * are injected into the environment.
 */

// vi is available as a global because globals:true is set in vitest.config.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).jest = vi;

/**
 * Patch Node's native Module._load to intercept CJS require() calls for:
 * - sharp: native binary not available in this test environment
 * - join-images: would otherwise load sharp
 * - @trpc/server/adapters/fetch: middleware.test.js uses CJS require so both
 *   the test and middleware.js get the same mock instance
 * - dist/trpc/router: prevents the real tRPC router (and its chain) from loading
 * - dist/trpc/context: stub the context factory
 *
 * This is needed because vitest's vi.mock() cannot intercept CJS require()
 * chains that originate from pre-built dist/ or from non-Vite-processed files.
 */
import Module from 'module';
import path from 'path';

// Shared fetchRequestHandler mock - both the test and middleware.js get this.
const _fetchRequestHandlerMock = vi.fn().mockResolvedValue(
  new Response(JSON.stringify({ result: 'ok' }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  }),
);

const _distTrpcRouterPath = path.resolve('./dist/trpc/router.js');
const _distTrpcContextPath = path.resolve('./dist/trpc/context.js');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const originalLoad = (Module as any)._load;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Module as any)._load = function patchedLoad(
  request: string,
  parent: any,
  isMain: boolean,
) {
  // Intercept sharp (native binary not available in this environment)
  if (request === 'sharp') return {};
  // Intercept join-images (which would otherwise try to import sharp)
  if (request === 'join-images') {
    return {
      default: vi.fn(async () => ({
        toFormat: vi.fn(() => ({
          toBuffer: vi.fn(async () => Buffer.from('')),
        })),
      })),
    };
  }
  // Intercept @trpc/server/adapters/fetch so middleware.js and the test share
  // the same mock instance (vi.mock() only patches ESM imports, not CJS require)
  if (request === '@trpc/server/adapters/fetch') {
    return { fetchRequestHandler: _fetchRequestHandlerMock };
  }
  // Intercept the compiled tRPC router to prevent loading the real screenshot
  // service chain (which requires sharp/join-images)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolved = (() => {
    try {
      return (Module as any)._resolveFilename(request, parent);
    } catch {
      return '';
    }
  })();
  if (
    resolved === _distTrpcRouterPath ||
    request.includes('dist/trpc/router') ||
    request.includes('dist\\trpc\\router')
  ) {
    return { appRouter: { _def: {} } };
  }
  if (
    resolved === _distTrpcContextPath ||
    request.includes('dist/trpc/context') ||
    request.includes('dist\\trpc\\context')
  ) {
    return { createContext: vi.fn().mockReturnValue({}) };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return originalLoad.call(this, request, parent, isMain);
};

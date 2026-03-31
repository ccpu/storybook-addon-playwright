// Changed: The original test used CJS require() which vitest's ESM vi.mock()
// cannot intercept for the deep dist/ CJS require chain. The fix uses a
// Module._load patch in setupTests.vitest-globals.ts to intercept sharp,
// join-images, @trpc/server/adapters/fetch, and dist/trpc/router at the
// native Node module level. Test reverted to require() so it picks up the
// same patches as middleware.js does.

const middleware = require('./middleware');
const { fetchRequestHandler } = require('@trpc/server/adapters/fetch');

describe('middleware', () => {
  it('should register a /trpc/* route handler', () => {
    const router = { all: vi.fn() };

    middleware(router);

    expect(router.all).toHaveBeenCalledWith('/trpc/*', expect.any(Function));
  });

  it('should call fetchRequestHandler and pipe response', async () => {
    const router = { all: vi.fn() };

    middleware(router);

    const handler = router.all.mock.calls[0][1];

    const req = {
      url: '/trpc/screenshot.takeScreenshot',
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    };

    const res = {
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    };

    await handler(req, res);

    expect(fetchRequestHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: '/trpc',
      }),
    );
    expect(res.statusCode).toBe(200);
    expect(res.end).toHaveBeenCalled();
  });
});

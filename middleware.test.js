jest.mock('@trpc/server/adapters/fetch', () => ({
  fetchRequestHandler: jest.fn().mockResolvedValue(
    new Response(JSON.stringify({ result: 'ok' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }),
  ),
}));

jest.mock('./dist/trpc/router', () => ({
  appRouter: { _def: {} },
}));

jest.mock('./dist/trpc/context', () => ({
  createContext: jest.fn().mockReturnValue({}),
}));

const middleware = require('./middleware');
const { fetchRequestHandler } = require('@trpc/server/adapters/fetch');

describe('middleware', () => {
  it('should register a /trpc/* route handler', () => {
    const router = { all: jest.fn() };

    middleware(router);

    expect(router.all).toHaveBeenCalledWith('/trpc/*', expect.any(Function));
  });

  it('should call fetchRequestHandler and pipe response', async () => {
    const router = { all: jest.fn() };

    middleware(router);

    const handler = router.all.mock.calls[0][1];

    const req = {
      url: '/trpc/screenshot.takeScreenshot',
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    };

    const res = {
      statusCode: 0,
      setHeader: jest.fn(),
      end: jest.fn(),
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

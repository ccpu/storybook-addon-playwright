// The test relies on the Module._load patch in setupTests.vitest-globals.ts
// to intercept CJS require() chains for sharp, join-images,
// @trpc/server/adapters/fetch, and dist/trpc/router at the native Node level.
// This only works in the 'forks' pool (see vitest.workspace.ts).

const middleware = require('./middleware');
const { fetchRequestHandler } = require('@trpc/server/adapters/fetch');

function createServer() {
  return {
    headersTimeout: 60000,
    keepAliveTimeout: 5000,
    requestTimeout: 300000,
    timeout: 120000,
    setTimeout: vi.fn(),
  };
}

function createResponse() {
  return new Response(JSON.stringify({ result: 'ok' }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

describe('middleware', () => {
  beforeEach(() => {
    fetchRequestHandler.mockResolvedValue(createResponse());
    vi.spyOn(console, 'info').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should register a /__storybook_playwright/trpc/* route handler', () => {
    const router = { all: vi.fn() };

    middleware(router);

    expect(router.all).toHaveBeenCalledWith(
      '/__storybook_playwright/trpc/*',
      expect.any(Function),
    );
  });

  it('should call fetchRequestHandler and pipe response', async () => {
    const router = { all: vi.fn() };

    middleware(router);

    const handler = router.all.mock.calls[0][1];

    const req = {
      url: '/__storybook_playwright/trpc/screenshot.takeScreenshot',
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    };

    const res = {
      statusCode: 0,
      write: vi.fn().mockReturnValue(true),
      setHeader: vi.fn(),
      end: vi.fn(),
    };

    await handler(req, res);

    expect(fetchRequestHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: '/__storybook_playwright/trpc',
      }),
    );
    expect(res.statusCode).toBe(200);
    expect(res.end).toHaveBeenCalled();
  });

  it('should stream web response chunks to the node response', async () => {
    const chunks = [
      new TextEncoder().encode('chunk-1'),
      new TextEncoder().encode('chunk-2'),
    ];
    fetchRequestHandler.mockResolvedValue({
      body: {
        getReader: () => ({
          read: vi.fn(async () => {
            const value = chunks.shift();
            return value ? { done: false, value } : { done: true };
          }),
          releaseLock: vi.fn(),
        }),
      },
      headers: {
        forEach: (callback) => {
          callback('application/jsonl', 'content-type');
        },
        get: (key) => (key === 'content-type' ? 'application/jsonl' : null),
      },
      status: 200,
    });

    const router = { all: vi.fn() };

    middleware(router);

    const handler = router.all.mock.calls[0][1];

    const req = {
      url: '/__storybook_playwright/trpc/screenshot.testScreenshots',
      method: 'POST',
      headers: { accept: 'application/jsonl', 'content-type': 'application/json' },
    };

    const res = {
      statusCode: 0,
      write: vi.fn().mockReturnValue(true),
      setHeader: vi.fn(),
      end: vi.fn(),
    };

    await handler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('content-type', 'application/jsonl');
    expect(res.write).toHaveBeenCalledTimes(2);
    expect(res.write.mock.calls[0][0].toString()).toBe('chunk-1');
    expect(res.write.mock.calls[1][0].toString()).toBe('chunk-2');
    expect(res.end).toHaveBeenCalled();
  });

  it('should disable request timeouts for long-running tRPC calls', async () => {
    const router = { all: vi.fn() };
    const socketServer = createServer();
    const connectionServer = createServer();
    const connection = {
      server: connectionServer,
      setTimeout: vi.fn(),
    };
    const resReq = {
      setTimeout: vi.fn(),
    };

    middleware(router);

    const handler = router.all.mock.calls[0][1];

    const req = {
      url: '/__storybook_playwright/trpc/screenshot.testScreenshots',
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      setTimeout: vi.fn(),
      socket: {
        server: socketServer,
        setKeepAlive: vi.fn(),
        setTimeout: vi.fn(),
      },
      connection,
    };

    const res = {
      statusCode: 0,
      write: vi.fn().mockReturnValue(true),
      setHeader: vi.fn(),
      setTimeout: vi.fn(),
      end: vi.fn(),
      req: resReq,
    };

    await handler(req, res);

    expect(req.setTimeout).toHaveBeenCalledWith(0);
    expect(res.setTimeout).toHaveBeenCalledWith(0);
    expect(req.socket.setTimeout).toHaveBeenCalledWith(0);
    expect(req.socket.setKeepAlive).toHaveBeenCalledWith(true);
    expect(connection.setTimeout).toHaveBeenCalledWith(0);
    expect(resReq.setTimeout).toHaveBeenCalledWith(0);
    expect(socketServer.requestTimeout).toBe(0);
    expect(socketServer.keepAliveTimeout).toBe(0);
    expect(socketServer.headersTimeout).toBe(0);
    expect(socketServer.timeout).toBe(0);
    expect(socketServer.setTimeout).toHaveBeenCalledWith(0);
    expect(connectionServer.requestTimeout).toBe(0);
  });

  it('should disable server timeouts from router.server during registration', () => {
    const server = createServer();
    const router = { all: vi.fn(), server };

    middleware(router);

    expect(server.requestTimeout).toBe(0);
    expect(server.keepAliveTimeout).toBe(0);
    expect(server.headersTimeout).toBe(0);
    expect(server.timeout).toBe(0);
    expect(server.setTimeout).toHaveBeenCalledWith(0);
  });
});

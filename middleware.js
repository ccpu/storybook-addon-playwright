const { fetchRequestHandler } = require('@trpc/server/adapters/fetch');
const { appRouter } = require('./dist/trpc/router');
const { createContext } = require('./dist/trpc/context');

const LOG_PREFIX = '[storybook-addon-playwright]';
const configuredServers = new WeakSet();

function getServerTimeouts(server) {
  return {
    headersTimeout: server.headersTimeout,
    keepAliveTimeout: server.keepAliveTimeout,
    requestTimeout: server.requestTimeout,
    timeout: server.timeout,
  };
}

// Long screenshot runs can exceed Node's default HTTP request timeout.
function disableServerTimeouts(server, source) {
  if (!server || typeof server !== 'object') return;

  server.requestTimeout = 0;
  server.keepAliveTimeout = 0;
  server.headersTimeout = 0;
  server.timeout = 0;

  if (typeof server.setTimeout === 'function') {
    server.setTimeout(0);
  }
}

// Disable per-request socket timers for the active addon request.
function disableRequestTimeout(req, res) {
  if (typeof req.setTimeout === 'function') {
    req.setTimeout(0);
  }

  if (typeof res.setTimeout === 'function') {
    res.setTimeout(0);
  }

  if (req.socket && typeof req.socket.setTimeout === 'function') {
    req.socket.setTimeout(0);
  }

  if (req.socket && typeof req.socket.setKeepAlive === 'function') {
    req.socket.setKeepAlive(true);
  }

  if (req.connection && typeof req.connection.setTimeout === 'function') {
    req.connection.setTimeout(0);
  }

  if (res.req && typeof res.req.setTimeout === 'function') {
    res.req.setTimeout(0);
  }
}

// Keep only diagnostic logs that explain interrupted long-running requests.
function addRequestLogs(req, res) {
  const startedAt = Date.now();
  let finished = false;
  const requestLabel = `${req.method || 'UNKNOWN'} ${req.url || ''}`;
  const elapsed = () => `${Date.now() - startedAt}ms`;

  if (typeof req.on === 'function') {
    req.on('aborted', () => {
      console.info(
        `${LOG_PREFIX} tRPC request aborted after ${elapsed()}: ${requestLabel}`,
      );
    });
    req.on('error', (error) => {
      console.error(
        `${LOG_PREFIX} tRPC request error after ${elapsed()}: ${requestLabel}`,
        error,
      );
    });
  }

  if (typeof res.on === 'function') {
    res.on('finish', () => {
      finished = true;
    });
    res.on('close', () => {
      if (!finished) {
        console.info(
          `${LOG_PREFIX} tRPC response closed before finish after ${elapsed()}: ${requestLabel}`,
        );
      }
    });
    res.on('error', (error) => {
      console.error(
        `${LOG_PREFIX} tRPC response error after ${elapsed()}: ${requestLabel}`,
        error,
      );
    });
  }
}

// Convert Storybook's Node request into the Web Request expected by tRPC.
function toWebRequest(req) {
  return new Request(`http://localhost${req.url}`, {
    method: req.method,
    headers: req.headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
    duplex: 'half',
  });
}

// Respect Node stream backpressure while forwarding tRPC response chunks.
function writeChunk(res, chunk) {
  return new Promise((resolve) => {
    if (res.write(Buffer.from(chunk))) {
      resolve();
      return;
    }

    res.once('drain', resolve);
  });
}

// Stream Web Response bodies to Node instead of buffering long tRPC results.
async function sendWebResponse(res, response) {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (!response.body) {
    res.end();
    return;
  }

  if (typeof response.body.getReader !== 'function') {
    const body = await response.arrayBuffer();
    res.end(Buffer.from(body));
    return;
  }

  const reader = response.body.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;
      await writeChunk(res, value);
    }
  } finally {
    reader.releaseLock();
  }

  res.end();
}

module.exports = function (router) {
  disableServerTimeouts(router && router.server, 'router.server');

  router.all('/__storybook_playwright/trpc/*', async (req, res) => {
    addRequestLogs(req, res);
    disableServerTimeouts(req.socket && req.socket.server, 'req.socket.server');
    disableServerTimeouts(
      req.connection && req.connection.server,
      'req.connection.server',
    );
    disableRequestTimeout(req, res);

    const request = toWebRequest(req);

    const response = await fetchRequestHandler({
      endpoint: '/__storybook_playwright/trpc',
      req: request,
      router: appRouter,
      createContext: () => createContext({ req, res }),
      onError: ({ error, path }) => {
        console.error(`[storybook-addon-playwright] tRPC error on "${path}"`, error);
      },
    });

    await sendWebResponse(res, response);
  });
};

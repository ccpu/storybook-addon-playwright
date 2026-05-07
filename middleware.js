const { fetchRequestHandler } = require('@trpc/server/adapters/fetch');
const { appRouter } = require('./dist/trpc/router');
const { createContext } = require('./dist/trpc/context');

function toWebRequest(req) {
  return new Request(`http://localhost${req.url}`, {
    method: req.method,
    headers: req.headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
    duplex: 'half',
  });
}

module.exports = function (router) {
  router.all('/trpc/*', async (req, res) => {
    const request = toWebRequest(req);

    const response = await fetchRequestHandler({
      endpoint: '/trpc',
      req: request,
      router: appRouter,
      createContext: () => createContext({ req, res }),
      onError: ({ error, path }) => {
        console.error(`[storybook-addon-playwright] tRPC error on "${path}"`, error);
      },
    });

    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    const body = await response.arrayBuffer();
    res.end(Buffer.from(body));
  });
};

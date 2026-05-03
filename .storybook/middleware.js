const middleware = require('../middleware');
const { setupPlaywright } = require('./setup-playwright');

const setupPlaywrightPromise = setupPlaywright();

// SSE endpoint used by live-reload-client.js.
// When tsup finishes a rebuild (onSuccess), Storybook is restarted — the browser
// loses the SSE connection, polls until the new server is up, then auto-reloads.

let sseClients = [];

module.exports = function (router) {
  router.all('/trpc/*', async (_req, res, next) => {
    try {
      await setupPlaywrightPromise;
      next();
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end('Playwright setup failed.');
    }
  });

  middleware(router);

  router.get('/__addon_live_reload', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    sseClients.push(res);
    req.on('close', () => {
      sseClients = sseClients.filter((c) => c !== res);
    });
  });
};

const middleware = require('../middleware');
const { setupPlaywright } = require('./setup-playwright');

(async () => {
  await setupPlaywright();
})();

// SSE endpoint used by live-reload-client.js.
// Currently not used for src/ changes (start-dev.js restarts the server for
// those), but kept here in case in-process signalling is needed in future.

let sseClients = [];

module.exports = function (router) {
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

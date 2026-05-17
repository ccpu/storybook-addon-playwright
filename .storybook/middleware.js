const middleware = require('../middleware');
const { setupPlaywright } = require('./setup-playwright');

const setupPlaywrightPromise = setupPlaywright();

// SSE endpoint used by live-reload-client.js.
// When tsup finishes a rebuild (onSuccess), Storybook is restarted — the browser
// loses the SSE connection, polls until the new server is up, then auto-reloads.

let sseClients = [];

module.exports = function (router) {
  middleware(router);
};

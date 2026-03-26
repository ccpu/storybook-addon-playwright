/**
 * Addon development live-reload client.
 *
 * Two scenarios handled:
 *
 * 1. Only stories/ or preview files changed (HMR handled by webpack already).
 *    The middleware sends an SSE message → we reload.
 *
 * 2. src/ (addon code) changed → start-dev.js restarts the storybook server.
 *    The browser loses the SSE connection (error event), then start-dev.js brings
 *    the server back up.  When we successfully reconnect we reload automatically
 *    so the browser picks up the freshly-compiled manager bundle.
 */
(function () {
  if (typeof window === 'undefined' || typeof EventSource === 'undefined')
    return;

  var hasConnectedOnce = false;
  var reloadOnNextOpen = false;

  function connect() {
    var es = new EventSource('/__addon_live_reload');

    es.addEventListener('open', function () {
      if (reloadOnNextOpen) {
        // We just reconnected after a server restart – reload to get new bundle.
        reloadOnNextOpen = false;
        window.location.reload();
        return;
      }

      hasConnectedOnce = true;
    });

    // Explicit reload signal from the middleware (e.g. for story file changes).
    es.addEventListener('message', function () {
      window.location.reload();
    });

    // Lost connection (server restarted). Retry until the new server is up.
    es.addEventListener('error', function () {
      if (hasConnectedOnce) {
        reloadOnNextOpen = true;
      }
      es.close();
      setTimeout(connect, 1000);
    });
  }

  connect();
})();

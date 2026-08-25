import middleware from '../dist/middleware.js';
import { setupPlaywright } from './setup-playwright.mjs';

void setupPlaywright();

// SSE endpoint used by live-reload-client.js.
// When tsup finishes a rebuild (onSuccess), Storybook is restarted — the browser
// loses the SSE connection, polls until the new server is up, then auto-reloads.

export default function storybookMiddleware(router) {
  middleware(router);
}

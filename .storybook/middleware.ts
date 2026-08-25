import middleware from '../src/middleware';
import { setupPlaywright } from './setup-playwright';

void setupPlaywright();

// SSE endpoint used by live-reload-client.js.
// When tsup finishes a rebuild (onSuccess), Storybook is restarted — the browser
// loses the SSE connection, polls until the new server is up, then auto-reloads.

export default function storybookMiddleware(router: Parameters<typeof middleware>[0]) {
  middleware(router);
}

---
'storybook-addon-playwright': major
---

Add Storybook 10 support with an ESM-only addon build, consolidated
`storybook/*` imports, and a standard manager entry. The public middleware and
configuration helpers are now ESM exports, and all Node helpers share one
configuration store across split output chunks.

Register the addon as `storybook-addon-playwright` (rather than the legacy
`storybook-addon-playwright/register` path) and use ESM imports for its
middleware and configuration helpers.

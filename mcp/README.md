# storybook-addon-playwright-mcp

A local **stdio MCP server** that teaches AI coding assistants how to author
visual/screenshot regression tests for the
[`storybook-addon-playwright`](../README.md) addon.

It is intentionally scoped: the server description tells the assistant to
consult it **only** when the user asks to _add a story screenshot / visual test_
or _generate Playwright screenshots_ — not on every Storybook or Playwright task.

## What it knows

- The `*.stories.playwright.json` action-file **format and naming convention**
  (same base name, same folder as the story file).
- How to build **action sets** and the full **action catalog** (searchable).
- **Selector strategy** — prefer `data-slot` / `data-testid` / `id`.
- **Screenshot sizing** — prefer focused `takeElementScreenshot` captures, and
  the `options.offset` inset for trimming unwanted edges.
- How screenshot **images are generated** (addon panel, tRPC endpoint, or the
  visual test suite).

## Tools

| Tool                             | Purpose                                                             |
| -------------------------------- | ------------------------------------------------------------------- |
| `get_screenshot_authoring_guide` | Workflow + conventions. Start here. Optional `topic` for a section. |
| `list_playwright_actions`        | List actions grouped by category.                                   |
| `search_playwright_actions`      | Rank actions by relevance for a query.                              |
| `get_playwright_action`          | Full detail + example for one action.                               |
| `get_example_playwright_json`    | A complete example action file.                                     |

## How it ships

This folder is **source only**; it is not published as its own npm package.
The addon's `tsup` build bundles [`src/cli.ts`](src/cli.ts) into
`dist/mcp/cli.mjs`, which the root `storybook-addon-playwright` package exposes
as a second bin:

```jsonc
// package.json (root)
"bin": {
  "storybook-addon-playwright": "./dist/cli.js",       // the addon's existing CLI (untouched)
  "storybook-addon-playwright-mcp": "./dist/mcp/cli.mjs" // this MCP server
}
```

So installing `storybook-addon-playwright` in a project makes the
`storybook-addon-playwright-mcp` bin available — no separate install, published
by the same release pipeline.

## Usage (in a consuming project)

Once `storybook-addon-playwright` is installed, register the server with your MCP
client. It resolves the bin from the project's `node_modules`:

```jsonc
{
  "mcpServers": {
    "storybook-playwright-screenshots": {
      "command": "npx",
      "args": ["-y", "storybook-addon-playwright-mcp"],
    },
  },
}
```

For Claude Code:

```bash
claude mcp add storybook-playwright-screenshots -- npx -y storybook-addon-playwright-mcp
```

## Development

This folder's dependencies (`@modelcontextprotocol/sdk`, `zod`, `vitest`, `tsx`,
`typescript`) are all present at the repo root, so **no separate install is
needed** — run the checks from the repo root:

```bash
pnpm exec tsc --noEmit -p mcp/tsconfig.json          # typecheck
pnpm exec vitest run --config mcp/vitest.config.ts   # tests (incl. schema-sync)
pnpm exec tsx mcp/src/cli.ts                          # run the server over stdio
```

CI runs the typecheck + tests via the "MCP server checks" step. The
[`schema-sync`](test/schema-sync.test.ts) test fails the build if
[`src/data/actions.ts`](src/data/actions.ts) drifts from the addon's generated
action schema (`src/api/server/data/action-schema.json`, produced from the
`PlaywrightPage` interface).

The production bin is produced by the root build (`pnpm build` at the repo
root → `dist/mcp/cli.mjs`).

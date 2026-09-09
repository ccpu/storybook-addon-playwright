# storybook-addon-playwright-mcp

A local **stdio MCP server** that teaches AI coding assistants how to author
visual/screenshot regression tests for the
[`storybook-addon-playwright`](https://github.com/ccpu/storybook-addon-playwright#readme) addon.

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

Two artifacts, one source tree:

| Artifact                                          | Built by                                   | Purpose                                                                      |
| ------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| `storybook-addon-playwright-mcp` (this package)   | `mcp/tsup.config.ts` → `mcp/dist/cli.mjs`  | Standalone, `npx`-able with nothing installed. Only deps: the MCP SDK + zod. |
| `storybook-addon-playwright` bin of the same name | root `tsup.config.ts` → `dist/mcp/cli.mjs` | Resolves from `node_modules/.bin` in projects that already use the addon.    |

```jsonc
// package.json (addon root) — unchanged, kept for projects already using the addon
"bin": {
  "storybook-addon-playwright": "./dist/cli.js",        // the addon's existing CLI
  "storybook-addon-playwright-mcp": "./dist/mcp/cli.mjs" // this MCP server
}
```

Both are versioned and published by the same [changesets](https://github.com/changesets/changesets)
pipeline, but **independently**: a commit touching `mcp/` releases this package,
a commit touching the addon releases the addon. The server reports whichever
package version actually shipped it (see `readVersion` in [`src/cli.ts`](src/cli.ts)).

## Usage (in a consuming project)

Nothing to install — `npx` fetches the package (~60 KB plus the MCP SDK):

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

In a project that already depends on `storybook-addon-playwright`, that same
command resolves the addon's bundled copy from `node_modules/.bin` instead of
downloading anything.

### Troubleshooting

`connection closed: initialize response` at startup means the server process
exited before the MCP handshake. Usual causes:

- **`npx` could not resolve the name** — on a version of the config predating the
  standalone package, `npx -y storybook-addon-playwright-mcp` only worked inside a
  project that had the addon installed. Upgrade to a released
  `storybook-addon-playwright-mcp`, or point the client at an absolute path:
  `node /abs/path/to/project/node_modules/storybook-addon-playwright/dist/mcp/cli.mjs`.
- **Working inside this repo** (pnpm does not link a package's own bins) → run
  `pnpm --filter storybook-addon-playwright-mcp build` and register
  `node <repo>/mcp/dist/cli.mjs`.

## Development

This folder is a workspace package (see `pnpm-workspace.yaml`), so a single
`pnpm install` at the repo root installs it. Run the checks from anywhere in the
repo:

```bash
pnpm --filter storybook-addon-playwright-mcp typecheck  # typecheck
pnpm --filter storybook-addon-playwright-mcp test       # tests (incl. schema-sync)
pnpm --filter storybook-addon-playwright-mcp build      # -> mcp/dist/cli.mjs
pnpm --filter storybook-addon-playwright-mcp dev        # run the server over stdio
```

CI runs all three via the "MCP server checks" step, and `changeset publish` runs
the build again through this package's `prepack` script. The
[`schema-sync`](test/schema-sync.test.ts) test fails the build if
[`src/data/actions.ts`](src/data/actions.ts) drifts from the addon's generated
action schema (`src/api/server/data/action-schema.json`, produced from the
`PlaywrightPage` interface).

The addon's own copy of the bin (`dist/mcp/cli.mjs`) is still produced by the
root build (`pnpm build` at the repo root).

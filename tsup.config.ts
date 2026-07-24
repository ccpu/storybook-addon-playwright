import { fileURLToPath } from 'node:url';
import { defineConfig, type Options } from 'tsup';

// ESM re-implementation of `react/jsx-(dev-)runtime`, inlined into the manager bundle
// (see src/jsx-runtime-shim.ts for why).
const jsxRuntimeShim = fileURLToPath(
  // @ts-ignore
  new URL('./src/jsx-runtime-shim.ts', import.meta.url),
);

const commonConfig: Options = {
  clean: false,
  external: ['react', 'react-dom', '@storybook/icons'],
  sourcemap: true,
  splitting: false,
  treeshake: true,
};

/*
 * React handling for the Storybook MANAGER (register) bundle.
 *
 * A manager addon must be a SELF-CONTAINED bundle: Storybook's manager runtime only
 * provides `react`, `react-dom` and a fixed set of `@storybook/*` packages as globals
 * — everything else (MUI-replacement UI, @emotion, sonner, @dnd-kit, @floating-ui,
 * nice-modal, trpc, …) must be bundled INTO register.js.
 *
 * The trap: tsup externalizes every `dependencies`/`peerDependencies` entry by
 * default, so those UI deps ended up as bare `import … from '@floating-ui/react'`
 * etc. in the output. Storybook then re-bundles each of them at the CONSUMER side,
 * where their `import { jsx } from 'react/jsx-runtime'` resolves to the host
 * project's React (e.g. 19). That React 19 jsx runtime reads a React-19-only internal
 * (`recentlyCreatedOwnerStacks`) off the React 18 manager global and throws
 * "Cannot read properties of undefined", crashing the whole manager. (It only
 * appeared to work through a local `link:`, because linking happens to resolve those
 * deps' `react/jsx-runtime` to the addon's own React 18.)
 *
 * Fix, entirely at addon build time:
 *   1. Bundle ALL dependencies (`noExternal: [/./]`) so nothing is re-resolved by the
 *      host.
 *   2. Re-externalize only what the manager runtime actually provides: `react`,
 *      `react-dom` and the Storybook manager globals.
 *   3. Inline `react/jsx-(dev-)runtime` from THIS package's pinned React 18 so the
 *      jsx runtime always matches the React 18 manager global, whatever React the
 *      host project uses.
 */
type EsbuildPlugin = NonNullable<Options['esbuildPlugins']>[number];

// Modules Storybook's manager runtime provides as window globals (mirrors
// `globalsNameReferenceMap` in @storybook/core/dist/manager/globals). Instead of
// leaving them `external` (which strands `require('react')` calls from bundled
// CJS/UMD deps and blows up as "Dynamic require of \"react\" is not supported"
// once Storybook re-bundles register.js as ESM), we resolve each one to a tiny
// virtual module that reads the corresponding window global. The result is a
// register bundle with ZERO external imports/requires.
const MANAGER_GLOBALS: Record<string, string> = {
  react: '__REACT__',
  'react-dom': '__REACT_DOM__',
  'react-dom/client': '__REACT_DOM_CLIENT__',
  '@storybook/icons': '__STORYBOOK_ICONS__',
  '@storybook/manager-api': '__STORYBOOK_API__',
  '@storybook/components': '__STORYBOOK_COMPONENTS__',
  '@storybook/channels': '__STORYBOOK_CHANNELS__',
  '@storybook/core-events': '__STORYBOOK_CORE_EVENTS__',
  '@storybook/core-events/manager-errors': '__STORYBOOK_CORE_EVENTS_MANAGER_ERRORS__',
  '@storybook/router': '__STORYBOOK_ROUTER__',
  '@storybook/theming': '__STORYBOOK_THEMING__',
  '@storybook/theming/create': '__STORYBOOK_THEMING_CREATE__',
  '@storybook/client-logger': '__STORYBOOK_CLIENT_LOGGER__',
  '@storybook/types': '__STORYBOOK_TYPES__',
};

const reactManagerRuntimePlugin: EsbuildPlugin = {
  name: 'react-manager-runtime',
  setup(build) {
    // Redirect the jsx runtime to an ESM shim built on `createElement` so it matches
    // the React 18 Storybook supplies as the `react` global, without pulling React's
    // CommonJS jsx-runtime (which would emit an unsupported dynamic require). (esbuild's
    // Go regex engine rejects the `u` flag, so this filter is intentionally un-flagged.)
    build.onResolve({ filter: /^react\/jsx-(dev-)?runtime$/ }, () => ({
      path: jsxRuntimeShim,
      external: false,
    }));
    // Map React + Storybook manager modules to their window globals; bundle the rest.
    build.onResolve({ filter: /.*/ }, (args) => {
      if (args.kind === 'entry-point' || !(args.path in MANAGER_GLOBALS)) {
        return null;
      }
      return { path: args.path, namespace: 'sb-manager-global' };
    });
    build.onLoad({ filter: /.*/, namespace: 'sb-manager-global' }, (args) => ({
      // CJS so esbuild's interop serves both `import` and `require` consumers; the
      // bare identifier resolves to the window global the manager runtime defines.
      contents: `module.exports = ${MANAGER_GLOBALS[args.path]};`,
      loader: 'js',
    }));
  },
};

export default defineConfig((overrideOptions) => {
  const isWatchMode = Boolean(overrideOptions.watch);

  const configs: Options[] = [
    /*
     * Manager entry: src/register.tsx → dist/register.js
     * Loaded by Storybook's esbuild as the addon manager UI. Fully self-contained:
     * every dependency is bundled, and React/@storybook modules are swapped for
     * their manager window globals by reactManagerRuntimePlugin — no external
     * imports or requires remain in the output.
     */
    {
      ...commonConfig,
      entry: { register: 'src/register.tsx' },
      // `noExternal` overrides tsup's default externalization of deps; the plugin
      // then maps manager-provided modules to window globals and inlines the jsx
      // runtime shim.
      external: [],
      noExternal: [/.*/],
      esbuildPlugins: [reactManagerRuntimePlugin],
      // Pin the inlined jsx runtime to its production build so it is self-contained
      // (no runtime `process.env` lookup) and matches the React 18 manager global.
      env: { NODE_ENV: 'production' },
      format: ['cjs'],
      minify: !isWatchMode,
      platform: 'browser',
      target: 'es2020',
    },
    /*
     * Node entries: index, server routes, constants.
     * These are loaded by Node (middleware, Jest helpers).
     */
    {
      ...commonConfig,
      dts: false,
      entry: {
        cli: 'src/cli.ts',
      },
      format: ['cjs'],
      minify: false,
      platform: 'node',
      target: 'node18',
    },
    /*
     * MCP server bin: mcp/src/cli.ts → dist/mcp/cli.mjs
     * Shipped as the separate `storybook-addon-playwright-mcp` bin (see package.json).
     * ESM output keeps top-level await / import.meta.url. The MCP SDK and zod are
     * left external (both are runtime dependencies of the package) — the SDK pulls
     * in CJS deps (ajv) that use dynamic require and cannot be safely ESM-bundled.
     */
    {
      ...commonConfig,
      dts: false,
      entry: {
        'mcp/cli': 'mcp/src/cli.ts',
      },
      format: ['esm'],
      minify: false,
      platform: 'node',
      target: 'node18',
    },
    {
      ...commonConfig,
      dts: !overrideOptions.watch,
      entry: {
        'ai/index': 'src/ai/index.ts',
        'external-utils/index': 'src/external-utils/index.ts',
        'api/server/routes': 'src/api/server/routes.ts',
        'constants/routes': 'src/constants/routes.ts',
        'get-screenshots': 'src/get-screenshots.ts',
        index: 'src/index.ts',
        'run-image-diff': 'src/run-image-diff.ts',
        'to-match-screenshots': 'src/to-match-screenshots.ts',
        'trpc/context': 'src/api/trpc/context.ts',
        'trpc/router': 'src/api/trpc/router.ts',
      },
      format: ['cjs', 'esm'],
      minify: !isWatchMode,
      platform: 'node',
      target: 'node18',
    },
  ];

  return configs;
});

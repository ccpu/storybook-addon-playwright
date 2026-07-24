import { createRequire } from 'node:module';
import { defineConfig, type Options } from 'tsup';
// @ts-ignore
const require = createRequire(import.meta.url);

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
 * Storybook's manager runtime supplies `react` / `react-dom` as React 18 globals,
 * so those bare imports must stay external. But bundled dependencies (@emotion,
 * sonner, …) import `react/jsx-runtime`, and Storybook does NOT expose a global for
 * that subpath. When the addon is installed with React as a peer dependency,
 * Storybook re-bundles `react/jsx-runtime` from the *host project's* React (e.g. 19).
 * That React 19 jsx runtime then reads a React-19-only internal
 * (`recentlyCreatedOwnerStacks`) off the React 18 global and throws
 * "Cannot read properties of undefined", which crashes the entire manager.
 *
 * Fix: keep bare `react` external, but INLINE `react/jsx-(dev-)runtime` from this
 * package's own pinned React 18 so the jsx runtime always matches the React 18
 * manager global, regardless of the host project's React version.
 *
 * This is done with a plugin (not `external` + `alias`) because esbuild's native
 * `external: ['react']` subpath-matches `react/jsx-runtime` and wins over any alias.
 * By removing `react` from `external` for this entry and owning resolution here, the
 * plugin has no competitor.
 */
type EsbuildPlugin = NonNullable<Options['esbuildPlugins']>[number];
const reactManagerRuntimePlugin: EsbuildPlugin = {
  name: 'react-manager-runtime',
  setup(build) {
    // Bare `react` / `react-dom` (incl. subpaths like react-dom/client) → external,
    // provided by Storybook's manager runtime. (esbuild's Go regex engine rejects
    // the `u` flag, so these filter patterns are intentionally un-flagged.)
    build.onResolve({ filter: /^react(-dom)?(\/.*)?$/ }, (args) => {
      if (/^react\/jsx-(?:dev-)?runtime$/u.test(args.path)) {
        // Inline the jsx runtime from this package's React 18.
        return { path: require.resolve(args.path), external: false };
      }
      return { path: args.path, external: true };
    });
  },
};

export default defineConfig((overrideOptions) => {
  const isWatchMode = Boolean(overrideOptions.watch);

  const configs: Options[] = [
    /*
     * Manager entry: src/register.tsx → dist/register.js
     * Loaded by Storybook's esbuild as the addon manager UI.
     * @storybook/icons is ESM-only so it must NOT be external here — tsup/esbuild
     * inlines it as CJS. Marking it external would leave a require('@storybook/icons')
     * call in the output which Storybook's ESM manager builder cannot handle.
     */
    {
      ...commonConfig,
      entry: { register: 'src/register.tsx' },
      // `react`/`react-dom` externality is handled by reactManagerRuntimePlugin so
      // that `react/jsx-runtime` can be inlined instead of externalized.
      external: [],
      esbuildPlugins: [reactManagerRuntimePlugin],
      // Pin the inlined jsx runtime to its production build so it is self-contained
      // (no runtime `process.env` lookup) and matches the React 18 manager global.
      env: { NODE_ENV: 'production' },
      format: ['cjs', 'esm'],
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

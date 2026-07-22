import { defineConfig, type Options } from 'tsup';

const commonConfig: Options = {
  clean: false,
  external: ['react', 'react-dom', '@storybook/icons'],
  sourcemap: true,
  splitting: false,
  treeshake: true,
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
      external: ['react', 'react-dom'],
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

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
      format: ['cjs'],
      minify: !isWatchMode,
      platform: 'browser',
      target: 'es2020',
    },
    /*
     * Node entries: preset, index, server routes, constants.
     * These are loaded by Node (Storybook preset, middleware, Jest helpers).
     */
    {
      ...commonConfig,
      dts: !overrideOptions.watch,
      entry: {
        'api/server/routes': 'src/api/server/routes.ts',
        'constants/routes': 'src/constants/routes.ts',
        'get-screenshots': 'src/get-screenshots.ts',
        index: 'src/index.ts',
        preset: 'src/preset.ts',
        'run-image-diff': 'src/run-image-diff.ts',
        'to-match-screenshots': 'src/to-match-screenshots.ts',
        'trpc/context': 'src/api/trpc/context.ts',
        'trpc/router': 'src/api/trpc/router.ts',
      },
      format: ['cjs'],
      minify: !isWatchMode,
      platform: 'node',
      target: 'node18',
    },
  ];

  return configs;
});

import { defineConfig, type Options } from 'tsup';

const commonConfig: Options = {
  clean: false,
  treeshake: true,
  splitting: false,
  sourcemap: true,
  external: ['react', 'react-dom', '@storybook/icons'],
};

export default defineConfig((overrideOptions) => {
  const configs: Options[] = [
    /*
     * Manager entry: src/register.tsx → dist/register.js
     * Loaded by Storybook's esbuild as the addon manager UI.
     */
    {
      ...commonConfig,
      entry: { register: 'src/register.tsx' },
      format: ['cjs'],
      platform: 'browser',
      target: 'es2020',
    },
    /*
     * Node entries: preset, index, server routes, constants.
     * These are loaded by Node (Storybook preset, middleware, Jest helpers).
     */
    {
      ...commonConfig,
      entry: {
        preset: 'src/preset.ts',
        index: 'src/index.ts',
        'get-screenshots': 'src/get-screenshots.ts',
        'run-image-diff': 'src/run-image-diff.ts',
        'to-match-screenshots': 'src/to-match-screenshots.ts',
        'api/server/routes': 'src/api/server/routes.ts',
        'constants/routes': 'src/constants/routes.ts',
      },
      format: ['cjs'],
      platform: 'node',
      target: 'node18',
      dts: !overrideOptions.watch,
    },
  ];

  return configs;
});

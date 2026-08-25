import { fileURLToPath } from 'node:url';
import { defineConfig, type Options } from 'tsup';

type EsbuildPlugin = NonNullable<Options['esbuildPlugins']>[number];

const jsxRuntimeShim = fileURLToPath(
  new URL('./src/jsx-runtime-shim.ts', import.meta.url),
);

const managerReactRuntimePlugin: EsbuildPlugin = {
  name: 'manager-react-runtime',
  setup(build) {
    build.onResolve({ filter: /^react\/jsx-(dev-)?runtime$/ }, () => ({
      external: false,
      path: jsxRuntimeShim,
    }));
  },
};

const commonConfig: Options = {
  clean: false,
  external: ['react', 'react-dom', '@storybook/icons'],
  format: ['esm'],
  sourcemap: true,
  splitting: true,
  treeshake: true,
};

export default defineConfig((options) => {
  const managerConfig: Options = {
    ...commonConfig,
    dts: false,
    entry: { manager: 'src/register.tsx' },
    // Bundle UI dependencies so they cannot resolve a consuming framework's
    // React compatibility layer (for example, Preact in an Astro project).
    // Storybook replaces these manager-provided imports when it loads the addon.
    external: [
      /^react$/,
      /^react-dom(?:\/.*)?$/,
      /^storybook(?:\/.*)?$/,
      /^@storybook\/icons(?:\/.*)?$/,
    ],
    noExternal: [
      /^(?!react$|react-dom(?:\/|$)|storybook(?:\/|$)|@storybook\/icons(?:\/|$)).+/,
    ],
    banner: {
      js: [
        "import * as __storybookAddonReact from 'react';",
        "const require = (id) => id === 'react' ? __storybookAddonReact : (() => { throw new Error('Unsupported dynamic require: ' + id); })();",
      ].join('\n'),
    },
    esbuildPlugins: [managerReactRuntimePlugin],
    platform: 'browser',
    target: 'esnext',
  };
  const nodeConfig: Options = {
    ...commonConfig,
    dts: !options.watch,
    entry: {
      'ai/index': 'src/ai/index.ts',
      'api/server/routes': 'src/api/server/routes.ts',
      cli: 'src/cli.ts',
      configs: 'src/configs.ts',
      'constants/routes': 'src/constants/routes.ts',
      'external-utils/index': 'src/external-utils/index.ts',
      'get-screenshots': 'src/get-screenshots.ts',
      index: 'src/index.ts',
      middleware: 'src/middleware.ts',
      'mcp/cli': 'mcp/src/cli.ts',
      'run-image-diff': 'src/run-image-diff.ts',
      'to-match-screenshots': 'src/to-match-screenshots.ts',
      'trpc/context': 'src/api/trpc/context.ts',
      'trpc/router': 'src/api/trpc/router.ts',
    },
    platform: 'node',
    target: 'node20.19',
  };

  return [managerConfig, nodeConfig];
});

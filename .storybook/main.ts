import path from 'path';
import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../**/*.stories.tsx'],
  addons: [
    '@storybook/addon-essentials',
    'storybook-dark-mode',
    path.resolve(__dirname, '../preset.js'),
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  // The manager is built by Storybook's esbuild at startup.
  // We inject live-reload-client.js so the browser auto-reloads when the server
  // restarts after a tsup rebuild (see tsup.config.ts / onSuccess: restartStorybook).
  // managerEntries: (entry = []) => [
  //   ...entry,
  //   path.resolve(__dirname, 'live-reload-client.js'),
  // ],

  webpackFinal: async (config) => {
    config.module!.rules!.push({
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              ['@babel/preset-env', { targets: { node: 'current' } }],
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
      ],
    });
    return config;
  },
};

export default config;

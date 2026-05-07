import path from 'path';
import type { StorybookConfig } from '@storybook/react-webpack5';

type LocalStorybookConfig = StorybookConfig & {
  managerEntries: (entry?: string[]) => string[];
};

const config: LocalStorybookConfig = {
  stories: ['../**/*.stories.tsx'],
  addons: ['@storybook/addon-essentials', 'storybook-dark-mode'],
  managerEntries: (entry = []) => [...entry, path.resolve(__dirname, '../register.js')],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

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

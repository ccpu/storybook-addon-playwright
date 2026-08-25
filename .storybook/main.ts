import type { StorybookConfig } from '@storybook/react-webpack5';
import { fileURLToPath } from 'node:url';

// import { setupPlaywright } from './setup-playwright';

// (() => {
//   setupPlaywright().catch((error) => {
//     console.error('Error setting up Playwright:', error);
//   });
// })();

const config: StorybookConfig = {
  stories: ['../**/*.stories.tsx'],
  addons: [
    import.meta.resolve('./local-preset.ts'),
    'storybook-dark-mode',
    '@storybook/addon-themes',
  ],

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
          loader: fileURLToPath(import.meta.resolve('babel-loader')),
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

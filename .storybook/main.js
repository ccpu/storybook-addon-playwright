const path = require('path');
module.exports = {
  stories: ['../stories/*.stories.[tj]sx'],
  addons: ['storybook-dark-mode', path.resolve(__dirname, '../preset.js')],
  // addons: ['storybook-dark-mode'],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    config.module.rules.push({
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

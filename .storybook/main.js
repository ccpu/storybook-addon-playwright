const path = require('path');
module.exports = {
  stories: ['../stories/*.stories.[tj]sx'],
  addons: ['storybook-dark-mode', path.resolve(__dirname, '../preset.js')],
  // addons: ['storybook-dark-mode'],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  // In Storybook 8, the manager is built by esbuild (not webpack) at startup,
  // with resolveExtensions [".ts",".tsx",...] and bundle:true.
  // By default, preset.js adds register.js → dist/register.js (pre-compiled TS).
  // Here we filter that out and substitute src/register.tsx directly so esbuild
  // compiles the TypeScript source on every startup — no `tsc` build step needed.
  // Changing any src/ file + restarting storybook (via start-dev.js) is enough.
  managerEntries: (entry = []) => {
    // Remove the register.js path that comes from preset.js (loads dist/register.js)
    const sep = path.sep;
    const without = entry.filter(
      (e) => !e.endsWith(sep + 'register.js') && !e.endsWith('/register.js'),
    );
    return [
      ...without,
      path.resolve(__dirname, '../src/register.tsx'),
      path.resolve(__dirname, 'live-reload-client.js'),
    ];
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

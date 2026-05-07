import type webpack from 'webpack';

module.exports = {
  addons: [],
  babel: async (config: webpack.Configuration) => config,
  managerEntries: (entry: string[] = []) => [
    ...entry,
    require.resolve('./register'),
  ],
  managerWebpack: async (config: webpack.Configuration) => config,
};

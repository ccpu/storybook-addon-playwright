import webpack from 'webpack';

module.exports = {
  addons: [],
  babel: async (config: webpack.Configuration) => {
    return config;
  },
  managerEntries: (entry: string[] = []) => {
    return [...entry, require.resolve('./register')];
  },
  managerWebpack: async (config: webpack.Configuration) => {
    return config;
  },
};

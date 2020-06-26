import webpack from 'webpack';
import VirtualModulePlugin from 'webpack-virtual-modules';
import path from 'path';

const storiesFilename = path.resolve(
  path.join(__dirname, `generated.playwright-addon.js`),
);

module.exports = {
  addons: [],
  babel: async (config: webpack.Configuration) => {
    return config;
  },
  managerBabel: async (config: webpack.Configuration) => {
    return config;
  },
  managerWebpack: async (config: webpack.Configuration) => {
    return config;
  },
  webpackFinal: async (config: webpack.Configuration, options) => {
    (config.entry as string[]).push(storiesFilename);

    const stories = (await options.presets.apply(
      'stories',
      [],
      options,
    )) as string[];

    config.plugins.push(
      new VirtualModulePlugin({
        [storiesFilename]: ``,
      }),
    );

    config.module.rules.push({
      exclude: [/node_modules/],
      test: /\.playwright-addon.js?$/,
      use: {
        loader: path.resolve(__dirname, '../dist/loader'),
        options: {
          stories: stories,
        },
      },
    });
    return config;
  },
};

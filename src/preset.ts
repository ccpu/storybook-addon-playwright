import webpack from 'webpack';
import VirtualModulePlugin from 'webpack-virtual-modules';
import path from 'path';
import { toRequireContextString } from '@storybook/core/dist/server/preview/to-require-context';

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
    const storiesFilename = path.resolve(
      path.join(options.configDir, `generated.playwright-addon.js`),
    );

    const stories = (await options.presets.apply(
      'stories',
      [],
      options,
    )) as string[];

    config.plugins.push(
      new VirtualModulePlugin({
        [storiesFilename]: `window.__playwright_addon_required_context__ = [${stories
          .map(toRequireContextString)
          .join(
            ',',
          )}];window.__playwright_addon_hot_reload_time__ = Date.now();`,
      }),
    );

    (config.entry as string[]).push(storiesFilename);

    return config;
  },
};

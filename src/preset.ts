import webpack from 'webpack';
import VirtualModulePlugin from 'webpack-virtual-modules';
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
    const stories = (await options.presets.apply(
      'stories',
      [],
      options,
    )) as string[];

    const virtualModulePlugins = config.plugins.filter(
      (x) => x instanceof VirtualModulePlugin,
    );

    config.plugins = config.plugins.filter(
      (x) => !(x instanceof VirtualModulePlugin),
    );

    let foundModule = false;

    /*

        Tried to use separate VirtualModulePlugin with different virtual file name in previous version,
        however its causes to knobs loose data on hot reload,
        it could also cause other unknown problem!

        Therefore until problem with filename solved as mentioned in github issue
        (https://github.com/storybookjs/storybook/issues/11335), we use following hack.

        it simply removes VirtualModulePlugin plugin and created new one with old data,
        but appends require.context to one of the following files:

        generated-entry.js
        generated-stories-entry.js

        generated-entry.js has been renamed to generated-stories-entry.js in version 6.
    */

    virtualModulePlugins.forEach((plugin: VirtualModulePlugin) => {
      const staticModules = plugin._staticModules;
      const virtualModuleMapping = Object.keys(staticModules).reduce(
        (vm, modulePath) => {
          let moduleContent = staticModules[modulePath];

          if (
            modulePath.endsWith('generated-entry.js') ||
            modulePath.endsWith('generated-stories-entry.js')
          ) {
            (foundModule = true),
              (moduleContent += `\n
            window.__playwright_addon_hot_reload_time__ = Date.now();\n
            window.__playwright_addon_required_context__ = [${stories
              .map(toRequireContextString)
              .join(',')}];
            `);
          }

          vm[modulePath] = moduleContent;

          return vm;
        },
        {},
      );

      config.plugins.push(new VirtualModulePlugin(virtualModuleMapping));
    });

    if (!foundModule) {
      throw new Error(
        'VirtualModulePlugin generate with storybook not found! possibly file name changed. ',
      );
    }

    return config;
  },
};

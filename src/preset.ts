import webpack from 'webpack';
import VirtualModulePlugin from 'webpack-virtual-modules';

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
  webpackFinal: async (config: webpack.Configuration) => {
    const virtualModulePlugins = config.plugins.filter(
      (x) =>
        ((x as unknown) as { _staticModules: { [key: string]: string } })
          ._staticModules,
    );

    config.plugins = config.plugins.filter(
      (x) => !(x instanceof VirtualModulePlugin),
    );

    let foundModule = false;

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
            window.__playwright_addon_hot_reload_time__ = Date.now();`);
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

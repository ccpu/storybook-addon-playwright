import webpack, { Compiler } from 'webpack';
import ModuleFilenameHelpers from 'webpack/lib/ModuleFilenameHelpers';
import { ConcatSource } from 'webpack-sources';

class ReloadTimestampPlugin {
  apply(compiler: Compiler) {
    let time = Date.now();

    compiler.hooks.compilation.tap('ReloadTimestampPlugin', (compilation) => {
      compilation.hooks.optimizeChunkAssets.tapAsync(
        'ReloadTimestampPlugin',
        (chunks, done) => {
          appendTimeToChunks(compilation, chunks);
          done();
        },
      );
    });

    compiler.hooks.beforeCompile.tap('ReloadTimestampPlugin', () => {
      time = Date.now();
    });

    function appendTime(
      compilation: webpack.compilation.Compilation,
      fileName: string,
    ) {
      compilation.assets[fileName] = new ConcatSource(
        String(
          `\n(function () { window.__playwright_addon_hot_reload_time__ = ${time};})();\n`,
        ),
        compilation.assets[fileName],
        String(``),
      );
    }

    function appendTimeToChunks(
      compilation: webpack.compilation.Compilation,
      chunks: webpack.compilation.Chunk[],
    ) {
      for (const chunk of chunks) {
        if (!chunk.rendered) {
          // Skip already rendered (cached) chunks
          // to avoid rebuilding unchanged code.
          continue;
        }

        for (const fileName of chunk.files) {
          if (ModuleFilenameHelpers.matchObject({ test: /\.js$/ }, fileName)) {
            appendTime(compilation, fileName);
          }
        }
      }
    }
  }
}

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
    config.plugins.push(new ReloadTimestampPlugin());

    // const virtualModulePlugins = config.plugins.filter(
    //   (x) =>
    //     (x as unknown as { _staticModules: { [key: string]: string } })
    //       ._staticModules,
    // );

    // config.plugins = config.plugins.filter(
    //   (x) => !(x instanceof VirtualModulePlugin),
    // );

    // let foundModule = false;

    // virtualModulePlugins.forEach((plugin: VirtualModulePlugin) => {
    //   const staticModules = plugin._staticModules;
    //   const virtualModuleMapping = Object.keys(staticModules).reduce(
    //     (vm, modulePath) => {
    //       let moduleContent = staticModules[modulePath];
    //       if (
    //         !foundModule &&
    //         (modulePath.endsWith('generated-entry.js') ||
    //           modulePath.endsWith('generated-stories-entry.js') ||
    //           modulePath.endsWith('storybook-stories.js') ||
    //           modulePath.endsWith('storybook-config-entry.js'))
    //       ) {
    //         (foundModule = true),
    //           (moduleContent += `\n
    //         window.__playwright_addon_hot_reload_time__ = Date.now();`);
    //       }

    //       vm[modulePath] = moduleContent;

    //       return vm;
    //     },
    //     {},
    //   );

    //   config.plugins.push(new VirtualModulePlugin(virtualModuleMapping));
    // });

    return config;
  },
};

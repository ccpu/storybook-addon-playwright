import webpack from 'webpack';
import VirtualModulePlugin from 'webpack-virtual-modules';
// import ModuleFilenameHelpers from 'webpack/lib/ModuleFilenameHelpers';
// import { ConcatSource } from 'webpack-sources';

/**
 * sometime throws window undefined error, need more work
 */

// class ReloadTimestampPlugin {
//   apply(compiler: webpack.Compiler) {
//     let time = Date.now();

//     compiler.hooks.compilation.tap('ReloadTimestampPlugin', (compilation) => {
//       compilation.hooks.optimizeChunkAssets.tapAsync(
//         'ReloadTimestampPlugin',
//         (chunks, done) => {
//           appendTimeToChunks(compilation, chunks);
//           done();
//         },
//       );
//     });

//     compiler.hooks.beforeCompile.tap('ReloadTimestampPlugin', () => {
//       time = Date.now();
//     });

//     function appendTime(
//       compilation: webpack.compilation.Compilation,
//       fileName: string,
//     ) {
//       compilation.assets[fileName] = new ConcatSource(
//         String(
//           `\n(function () {
//                 if (typeof(window) !== 'undefined'){
//                   window.__playwright_addon_hot_reload_time__ = ${time};
//                 }
//             })();\n`,
//         ),
//         compilation.assets[fileName],
//         String(``),
//       );
//     }

//     function appendTimeToChunks(
//       compilation: webpack.compilation.Compilation,
//       chunks: webpack.compilation.Chunk[],
//     ) {
//       for (const chunk of chunks) {
//         if (!chunk.rendered) {
//           // Skip already rendered (cached) chunks
//           // to avoid rebuilding unchanged code.
//           continue;
//         }

//         for (const fileName of chunk.files) {
//           if (ModuleFilenameHelpers.matchObject({ test: /\.js$/ }, fileName)) {
//             console.log(fileName);
//             appendTime(compilation, fileName);
//           }
//         }
//       }
//     }
//   }
// }

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
  webpackFinal: async (config: webpack.Configuration) => {
    // Find all VirtualModulePlugin instances (regardless of version) by their _staticModules property
    const virtualModulePlugins = config.plugins.filter(
      (x) =>
        (x as unknown as { _staticModules: { [key: string]: string } })
          ._staticModules,
    );

    // Remove them using the same property check (not instanceof, which breaks due to version mismatch)
    config.plugins = config.plugins.filter(
      (x) => !(x as unknown as { _staticModules: unknown })._staticModules,
    );

    let foundModule = false;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    virtualModulePlugins.forEach((plugin: VirtualModulePlugin) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const staticModules = plugin._staticModules;
      const virtualModuleMapping = Object.keys(staticModules).reduce(
        (vm, modulePath) => {
          let moduleContent = staticModules[modulePath];
          if (
            !foundModule &&
            (modulePath.endsWith('generated-entry.js') ||
              modulePath.endsWith('generated-stories-entry.js') ||
              modulePath.endsWith('storybook-stories.js') ||
              modulePath.endsWith('storybook-config-entry.js') ||
              modulePath.includes('virtual-') ||
              modulePath.includes('node_modules/.cache/storybook'))
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

      // Re-create using the same constructor as the original plugin to avoid version mismatch
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const PluginClass = (plugin as any).constructor;
      config.plugins.push(new PluginClass(virtualModuleMapping));
    });

    if (!foundModule) {
      console.warn(
        'storybook-addon-playwright: VirtualModulePlugin entry not found. Hot reload detection may not work.',
      );
    }

    return config;
  },
};

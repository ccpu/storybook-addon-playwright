import webpack from 'webpack';
// import { toRequireContextString } from '@storybook/core/dist/server/preview/to-require-context';
// import VirtualModulePlugin from 'webpack-virtual-modules';
// import {} from '../dist/loader';

import path from 'path';
// const virtualModules = new VirtualModulePlugin();

// const filePath = path.resolve(
//   path.join(__dirname, `get-story-relative-path.js`),
// );

// console.log(filePath);

// class HelloAsyncPlugin {
//   stories;
//   constructor(stories) {
//     this.stories = stories;
//   }

//   apply(compiler) {
//     // console.log('init');

//     compiler.hooks.compilation.tap('required-context-plugin', async () => {
//       console.log('compilation');
//       if (this.stories && this.stories.length) {
//         virtualModules.writeModule(
//           filePath,
//           `module.exports= [${this.stories
//             .map(toRequireContextString)
//             .join(',')}]`,
//         );
//       }
//     });

//   }
// }

// const write = () => {
//   setTimeout(() => {
//     console.log('write');
//     virtualModules.writeModule(filePath, `console.log('emit1')`);
//     write();
//   }, 15000);
// };
// write();
// setTimeout(() => {
//   console.log('write');
//   virtualModules.writeModule(
//     'node_modules/get-story-relative-path.js',
//     `module.exports= []`,
//   );
// }, 20000);

module.exports = {
  addons: [],
  babel: async (config: webpack.Configuration) => {
    return config;
  },
  managerBabel: async (config: webpack.Configuration) => {
    // update config here
    return config;
  },
  managerWebpack: async (config: webpack.Configuration, options) => {
    // config.module.rules.push({
    //   exclude: [/node_modules/],
    //   test: /\.(ts|js)x?$/,
    //   use: {
    //     loader: 'babel-loader',
    //     options: {
    //       presets: ['@babel/preset-react'],
    //     },
    //   },
    // });

    // config.resolve.extensions.push('.ts', '.tsx');

    // const stories = (await options.presets.apply(
    //   'stories',
    //   [],
    //   options,
    // )) as string[];

    // if (stories && stories.length) {
    //   config.plugins.push(
    //     new VirtualModulePlugin({
    //       'node_modules/get-story-relative-path.js': `
    //      module.exports= [${stories.map(toRequireContextString).join(',')}]
    //   `,
    //     }),
    //   );
    // }

    // config.plugins.push(
    //   new VirtualModulePlugin({
    //     'node_modules/get-story-relative-path.js': `
    //         let _context;

    //         export function setRequiredContext(context) {
    //           _context = context;
    //         };
    //         export function getRequiredContext() {
    //           return _context;
    //         };
    //   `,
    //   }),
    // );

    config.resolve.alias = {
      ...config.resolve.alias,
      requiredContext: path.resolve(__dirname, '../dist/required-context'),
    };

    config.plugins.push(
      new webpack.ProvidePlugin({
        requiredContext: 'requiredContext',
      }),
    );

    // config.plugins.push(virtualModules);

    return config;
  },
  webpackFinal: async (config: webpack.Configuration, options) => {
    const stories = (await options.presets.apply(
      'stories',
      [],
      options,
    )) as string[];
    config.module.rules.push({
      exclude: [/node_modules/],
      test: /\.(ts|js)x?$/,
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

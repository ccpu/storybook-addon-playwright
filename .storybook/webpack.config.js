const path = require('path');

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.tsx?$/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
      },
    },
    exclude: [/node_modules/],
  });
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};

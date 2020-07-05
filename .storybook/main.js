const path = require('path');
module.exports = {
  stories: ['../stories/*.stories.[tj]sx'],
  addons: [
    'storybook-dark-mode/register',
    path.resolve(__dirname, '../preset.js'),
  ],
};

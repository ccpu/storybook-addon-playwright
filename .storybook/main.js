const path = require('path');
module.exports = {
  stories: ['../stories/*.stories.[tj]sx'],
  addons: [path.resolve(__dirname, '../preset.js')],
};

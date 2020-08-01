const middleware = require('../middleware');
const { setupPlaywright } = require('./setup-playwright');

(async () => {
  await setupPlaywright();
})();

module.exports = middleware;

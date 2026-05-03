const trpcRouter = require('./dist/trpc/router');

module.exports = {
  getConfigs: trpcRouter.getConfigs,
  setConfig: trpcRouter.setConfig,
};

const middleware = require('../middleware');

const { setConfig } = require('../configs');

const playwright = require('playwright');

(async () => {
  let browser = {
    chromium: await playwright['chromium'].launch(),
    firefox: await playwright['firefox'].launch(),
    webkit: await playwright['webkit'].launch(),
  };
  setConfig({
    storybookEndpoint: `http://localhost:9001/`,

    getPage: async (browserType, device) => {
      const context = await browser[browserType].newContext({ ...device });
      const page = await context.newPage();
      return page;
    },

    afterScreenshot: async (page) => {
      await page.close();
    },
  });
})();

module.exports = middleware;

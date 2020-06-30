const middleware = require('../middleware');

const { setConfig } = require('../configs');

const playwright = require('playwright');

//async function addBox(this: Page, position: { x: number; y: number })
async function addBox(position) {
  await this.evaluate((pos) => {
    if (!pos) return;
    const div = document.createElement('div');
    div.style.backgroundColor = '#009EEA';
    div.style.width = '200px';
    div.style.height = '200px';
    div.style.position = 'absolute';
    div.style.top = pos.y + 'px';
    div.style.left = pos.x + 'px';
    document.body.append(div);
  }, position);
}

(async () => {
  let browser = {
    chromium: await playwright['chromium'].launch(),
    firefox: await playwright['firefox'].launch(),
    webkit: await playwright['webkit'].launch(),
  };
  setConfig({
    storybookEndpoint: `http://localhost:6006/`,
    getPage: async (browserType, device) => {
      const context = await browser[browserType].newContext({ ...device });
      const page = await context.newPage();
      page.addBox = addBox;
      return page;
    },
    afterScreenshot: async (page) => {
      await page.close();
    },
    customActionSchema: {
      addBox: {
        type: 'promise',
        parameters: {
          position: {
            type: 'object',
            properties: {
              x: {
                type: 'number',
              },
              y: {
                type: 'number',
              },
            },
            required: ['x', 'y'],
          },
        },
      },
    },
  });
})();

module.exports = middleware;

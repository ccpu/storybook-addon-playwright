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
    div.style.zIndex = '10000000';

    document.body.append(div);
  }, position);
}

async function setupPlaywright() {
  let browser = {
    chromium: await playwright['chromium'].launch(),
    firefox: await playwright['firefox'].launch(),
    webkit: await playwright['webkit'].launch(),
  };
  setConfig({
    storybookEndpoint: `http://localhost:6006/`,
    getPage: async (browserType, options) => {
      const page = await browser[browserType].newPage(options);
      page.addBox = addBox;
      return page;
    },
    afterScreenshot: async (page) => {
      await page.close();
    },
    autoMigration: true,
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
}

module.exports = { setupPlaywright };

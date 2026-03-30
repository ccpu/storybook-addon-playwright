const { setConfig } = require('../configs');
const playwright = require('playwright');

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
  try {
    const browser = {};

    setConfig({
      storybookEndpoint: 'http://localhost:9002/',
      getPage: async (browserType, options) => {
        if (!browser[browserType]) {
          browser[browserType] = await playwright[browserType].launch();
        }
        const page = await browser[browserType].newPage(options);
        page.addBox = addBox;
        return page;
      },
      afterNavigation: async (page) => {
        await page.waitForFunction(() => {
          const root =
            document.getElementById('storybook-root') ||
            document.getElementById('root');

          return (root?.childNodes.length ?? 0) > 0;
        });
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
                x: { type: 'number' },
                y: { type: 'number' },
              },
              required: ['x', 'y'],
            },
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  setupPlaywright,
};

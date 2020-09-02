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
  try {
    let browser;
    setConfig({
      storybookEndpoint: `http://localhost:9001/`,
      getPage: async (browserType, options) => {
        if (!browser) {
          browser = {
            chromium: await playwright['chromium'].launch(),
            firefox: await playwright['firefox'].launch(),
            webkit: await playwright['webkit'].launch(),
          };
        }

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
      pageGotoOptions: {
        timeout: 5000,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = { setupPlaywright };

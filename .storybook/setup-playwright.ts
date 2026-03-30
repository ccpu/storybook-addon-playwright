import { setConfig } from '../configs';
import playwright, { type Page } from 'playwright';

async function addBox(
  this: Page,
  position: { x: number; y: number } | undefined,
) {
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

export async function setupPlaywright() {
  try {
    let browser: {
      chromium?: Awaited<ReturnType<typeof playwright.chromium.launch>>;
      firefox?: Awaited<ReturnType<typeof playwright.firefox.launch>>;
      webkit?: Awaited<ReturnType<typeof playwright.webkit.launch>>;
    } = {};

    setConfig({
      storybookEndpoint: `http://localhost:9002/`,
      getPage: async (
        browserType: 'chromium' | 'firefox' | 'webkit',
        options?: object,
      ) => {
        if (!browser[browserType]) {
          browser[browserType] = await playwright[browserType].launch();
        }
        const page = await browser[browserType]!.newPage(options);
        (page as Page & { addBox: typeof addBox }).addBox = addBox;
        return page;
      },
      afterNavigation: async (page: Page) => {
        await page.waitForFunction(() => {
          const root =
            document.getElementById('storybook-root') ||
            document.getElementById('root');

          return (root?.childNodes.length ?? 0) > 0;
        });
      },
      afterScreenshot: async (page: Page) => {
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
      // compareScreenshot: async (data) => {
      //   if (data.requestType !== 'all') return false;
      //   return new Promise((resolve, reject) => {
      //     const result = data.screenshot.base64 === data.baseImage.base64;
      //     if (!result)
      //       reject(new Error('Screenshots base64 are not identical!'));
      //     else
      //       resolve({ pass: result });
      //   });
      // },
      // screenshotOptions: {
      //   mergeType: 'stitch',
      //   stitchOptions: { offset: 5 },
      //   overlayOptions: { blend: 'add' },
      // },
      // pageGotoOptions: {
      //   timeout: 5000,
      // },
    });
  } catch (error) {
    console.error(error);
  }
}

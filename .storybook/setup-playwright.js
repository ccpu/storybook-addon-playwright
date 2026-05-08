// @ts-check

const { setConfig } = /** @type {typeof import('../src/api/server/configs')} */ (
  require('../configs')
);
const playwright = require('playwright');

/**
 * @typedef {import('../src/typings/config').Config} Config
 * @typedef {{ evaluate: (pageFunction: (pos: { x: number; y: number } | undefined) => void, arg: { x: number; y: number } | undefined) => Promise<void> }} BoxPage
 * @typedef {{ newPage: (options?: any) => Promise<any> }} BrowserInstance
 */

/** @type {Partial<Record<import('../src/typings/screenshot').BrowserTypes, BrowserInstance>>} */
const browser = {};

/**
 * @this {BoxPage}
 * @param {{ x: number; y: number } | undefined} position
 */
async function addBox(position) {
  /** @param {{ x: number; y: number } | undefined} pos */
  const drawBox = (pos) => {
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
  };

  await this.evaluate(drawBox, position);
}

/**
 * @param {import('../src/typings/screenshot').BrowserTypes} browserType
 * @param {import('../src/typings/screenshot').BrowserContextOptions} options
 * @param {unknown} _requestData
 * @returns {Promise<any>} A Playwright page instance.
 */
async function getPage(browserType, options, _requestData) {
  if (!browser[browserType]) {
    browser[browserType] = await playwright[browserType].launch();
  }

  const currentBrowser = browser[browserType];
  if (!currentBrowser) {
    throw new Error(`Browser ${browserType} failed to initialize.`);
  }

  const page = await currentBrowser.newPage(options);
  /** @type {BoxPage & { addBox: typeof addBox }} */
  (page).addBox = addBox;

  return page;
}

/**
 * @param {any} page
 * @returns {Promise<void>}
 */
async function afterNavigation(page) {
  await page.waitForFunction(() => {
    const root = document.getElementById('storybook-root') || document.getElementById('root');

    return (root?.childNodes.length ?? 0) > 0;
  });
}

/**
 * @param {any} page
 * @returns {Promise<void>}
 */
async function afterScreenshot(page) {
  await page.close();
}

async function setupPlaywright() {
  try {
    /** @type {Config & { autoMigration: boolean }} */
    const config = {
      storybookEndpoint: 'http://localhost:9002/',
      getPage,
      afterNavigation,
      afterScreenshot,
      autoMigration: true,
      customActionSchema: {
        addBox: {
          type: /** @type {never} */ ('Promise'),
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
    };

    setConfig(config);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  setupPlaywright,
};

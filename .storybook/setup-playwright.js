/**
 * @typedef {import('../src/typings/config').Config} Config
 * @typedef {{ evaluate: (pageFunction: (pos: { x: number; y: number } | undefined) => void, arg: { x: number; y: number } | undefined) => Promise<void> }} BoxPage
 * @typedef {{ newPage: (options?: any) => Promise<any> }} BrowserInstance
 */

import os from 'node:os';

const { setConfig } = /** @type {typeof import('../src/api/server/configs')} */ (
  require('../configs')
);
const playwright = require('playwright');

const PLAYWRIGHT_WS_BASE_URL =
  process.env.PLAYWRIGHT_WS_BASE_URL ?? 'ws://127.0.0.1:3010';

const LOCAL_PLAYWRIGHT = true;
const STORYBOOK_PORT = 1090;

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();

  for (const interfaceName of Object.keys(interfaces)) {
    const networkInterface = interfaces[interfaceName];

    if (!networkInterface) {
      continue;
    }

    for (const net of networkInterface) {
      // Skip internal (localhost) and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }

  return undefined;
}

/** @type {Partial<Record<import('../src/typings/screenshot').BrowserTypes, BrowserInstance>>} */
const browser = {};

function getStorybookEndpoint() {
  if (LOCAL_PLAYWRIGHT) {
    return 'http://localhost:' + STORYBOOK_PORT + '/';
  }
  return 'http://' + getLocalIpAddress() + ':' + STORYBOOK_PORT + '/';
}

async function getBrowser(browserType) {
  if (browser[browserType]) {
    return browser[browserType];
  }
  if (LOCAL_PLAYWRIGHT) {
    console.log(`[setup-playwright] Launched local ${browserType} Playwright instance`);
    browser[browserType] = await playwright[browserType].launch();
    return browser[browserType];
  }
  const wsEndpoint = PLAYWRIGHT_WS_BASE_URL + '/' + browserType;
  browser[browserType] = await playwright[browserType].connect(wsEndpoint);
  console.log(
    `[setup-playwright] Connected ${browserType} to remote Playwright server at ${wsEndpoint}`,
  );
  return browser[browserType];
}

/**
 * @param {import('../src/typings/screenshot').BrowserTypes} browserType
 * @returns {Promise<BrowserInstance>} Connected remote browser instance.
 */
async function getBrowserInstance(browserType) {
  try {
    return await getBrowser(browserType);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to start Playwright browser ${browserType}. If the browser executable is missing, run \`pnpm exec playwright install\`. Original error: ${message}`,
    );
  }
}

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
  const currentBrowser = await getBrowserInstance(browserType);
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
    const root =
      document.getElementById('storybook-root') || document.getElementById('root');

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
      getScreenshotTitle: (requestData) => {
        if (Object.keys(requestData.story.changedArgs ?? {}).length === 0) {
          return 'Should render correctly.';
        }
        return '';
      },
      storybookEndpoint: getStorybookEndpoint(),
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

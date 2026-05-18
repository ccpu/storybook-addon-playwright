import type { Browser } from 'playwright';

import { BrowserManager } from '../../src/external-utils/browser-manager';
import type { BrowserTypes } from '../../src/typings';

type FakeBrowser = Browser & {
  connected: boolean;
  id: string;
};

function createFakeBrowser(id: string, connected = true) {
  return {
    connected,
    id,
  } as FakeBrowser;
}

describe('BrowserManager', () => {
  const browserCount = {
    chromium: 2,
    firefox: 1,
    webkit: 1,
  } as const;

  it('should round-robin browser indexes and reuse connected browsers', async () => {
    const createdBrowsers: FakeBrowser[] = [];
    const createBrowser = vi.fn(
      async (browserType: BrowserTypes, browserIndex: number) => {
        const browser = createFakeBrowser(`${browserType}-${browserIndex}`);

        createdBrowsers.push(browser);

        return browser;
      },
    );
    const isBrowserConnected = vi.fn(
      (browser: Browser) => (browser as FakeBrowser).connected,
    );

    const manager = new BrowserManager({
      browserCount,
      createBrowser,
      isBrowserConnected,
    });

    await expect(manager.getBrowser('chromium')).resolves.toMatchObject({
      index: 0,
      browser: createdBrowsers[0],
    });
    await expect(manager.getBrowser('chromium')).resolves.toMatchObject({
      index: 1,
      browser: createdBrowsers[1],
    });
    await expect(manager.getBrowser('chromium')).resolves.toMatchObject({
      index: 0,
      browser: createdBrowsers[0],
    });

    expect(createBrowser).toHaveBeenCalledTimes(2);
    expect(isBrowserConnected).toHaveBeenCalledTimes(1);
  });

  it('should recreate a disconnected browser before returning it', async () => {
    const firstBrowser = createFakeBrowser('chromium-0', false);
    const replacementBrowser = createFakeBrowser('chromium-0-replacement');
    let chromiumZeroCreationCount = 0;
    const createBrowser = vi.fn(
      async (browserType: BrowserTypes, browserIndex: number) => {
        if (browserType === 'chromium' && browserIndex === 0) {
          if (chromiumZeroCreationCount === 0) {
            chromiumZeroCreationCount += 1;

            return firstBrowser;
          }

          chromiumZeroCreationCount += 1;

          return replacementBrowser;
        }

        return createFakeBrowser(`${browserType}-${browserIndex}`);
      },
    );
    const isBrowserConnected = vi.fn(
      (browser: Browser) => (browser as FakeBrowser).connected,
    );

    const manager = new BrowserManager({
      browserCount,
      createBrowser,
      isBrowserConnected,
    });

    await manager.getBrowser('chromium');
    await manager.getBrowser('chromium');
    const reopenedBrowser = await manager.getBrowser('chromium');

    expect(reopenedBrowser).toMatchObject({
      index: 0,
      browser: replacementBrowser,
    });
    expect(createBrowser).toHaveBeenCalledTimes(3);
  });
});

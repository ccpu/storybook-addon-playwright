import type { Browser } from 'playwright';

import type { BrowserTypes } from '../typings';

type BrowserStore = Record<BrowserTypes, Record<number, Browser>>;

export interface BrowserManagerConfig {
  browserCount: Record<BrowserTypes, number>;
  createBrowser: (browserType: BrowserTypes, browserIndex: number) => Promise<Browser>;
  isBrowserConnected: (browser: Browser) => boolean;
  resetBrowser?: (
    browser: Browser,
    browserType: BrowserTypes,
    browserIndex: number,
  ) => Promise<void>;
}

export class BrowserManager {
  private readonly browserTypes: BrowserTypes[];

  private readonly browsers: BrowserStore;

  private readonly nextBrowserNum: Record<BrowserTypes, number>;

  constructor(private readonly config: BrowserManagerConfig) {
    this.browserTypes = Object.keys(this.config.browserCount) as BrowserTypes[];

    this.browsers = {} as BrowserStore;
    this.nextBrowserNum = {} as Record<BrowserTypes, number>;

    for (const browserType of this.browserTypes) {
      this.browsers[browserType] = {};
      this.nextBrowserNum[browserType] = 0;
    }
  }

  private getBrowserCount(browserType: BrowserTypes): number {
    const browserCount = this.config.browserCount[browserType];

    if (!browserCount || browserCount < 1) {
      throw new Error(`Browser count for "${browserType}" must be greater than 0.`);
    }

    return browserCount;
  }

  private async ensureBrowser(
    browserType: BrowserTypes,
    browserIndex: number,
  ): Promise<Browser> {
    let browser = this.browsers[browserType][browserIndex];

    if (!browser || !this.config.isBrowserConnected(browser)) {
      browser = await this.config.createBrowser(browserType, browserIndex);
      this.browsers[browserType][browserIndex] = browser;
    }

    return browser;
  }

  public async forEachBrowser(
    browserType: BrowserTypes,
    callback: (browser: Browser, index: number) => Promise<void> | void,
  ): Promise<void> {
    const browserCount = this.getBrowserCount(browserType);

    for (let i = 0; i < browserCount; i++) {
      const browser = await this.ensureBrowser(browserType, i);
      await callback(browser, i);
    }
  }

  public async loadBrowser(browserType: BrowserTypes): Promise<void> {
    await this.forEachBrowser(browserType, () => undefined);
  }

  public async loadBrowsers(
    browserTypes: readonly BrowserTypes[] = this.browserTypes,
  ): Promise<void> {
    for (const browserType of browserTypes) {
      await this.loadBrowser(browserType);
    }
  }

  public async resetBrowser(browserType: BrowserTypes): Promise<void> {
    if (!this.config.resetBrowser) {
      return;
    }

    await this.forEachBrowser(browserType, async (browser, index) => {
      await this.config.resetBrowser!(browser, browserType, index);
    });
  }

  public async resetBrowsers(
    browserTypes: readonly BrowserTypes[] = this.browserTypes,
  ): Promise<void> {
    for (const browserType of browserTypes) {
      await this.resetBrowser(browserType);
    }
  }

  public async getBrowser(
    browserType: BrowserTypes,
  ): Promise<{ browser: Browser; index: number }> {
    const browserCount = this.getBrowserCount(browserType);
    const browserIndex = this.nextBrowserNum[browserType] % browserCount;

    this.nextBrowserNum[browserType] = browserIndex + 1;

    const browser = await this.ensureBrowser(browserType, browserIndex);

    return {
      browser,
      index: browserIndex,
    };
  }
}

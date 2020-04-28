import { Page } from 'playwright-core';

export type BrowserTypes = 'chromium' | 'firefox' | 'webkit';

export interface PageInfo<T extends unknown = Page> {
  page: T;
  browserName: BrowserTypes;
}

type PartialPage = Partial<Page>;

// export type HelperReturnType<T> = Promise<PageInfo<T> | PageInfo<T>[]>;

interface Action {
  name: string;
  labe?: string;
  execute: () => void;
}

export interface SetupSnapHelper<T extends PartialPage> {
  storybookEndpoint?: string;
  browserTypes: BrowserTypes[];
  getPage: (browserType: BrowserTypes) => Promise<PageInfo<T>[]>;
  beforeSnapshot?: (page: Page, browserType: BrowserTypes) => PageInfo<T>[];
  afterSnapshot?: (page: Page, browserType: BrowserTypes) => void;
  actions?: Action;
}

export interface ScreenshotInfo {
  buffer: Buffer;
  browserName: BrowserTypes;
  base64?: string;
}

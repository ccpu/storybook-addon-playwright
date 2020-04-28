import { Page } from 'playwright-core';

export type BrowserTypes = 'chromium' | 'firefox' | 'webkit';

export interface PageInfo<T extends unknown = Page> {
  page: T;
  browserName: BrowserTypes;
}

interface Action {
  name: string;
  labe?: string;
  execute: () => void;
}

export interface SetupSnapHelper<T extends unknown = Page> {
  storybookEndpoint?: string;
  getPage: (browserType: BrowserTypes) => Promise<T>;
  beforeSnapshot?: (page: T, browserType: BrowserTypes) => void;
  afterSnapshot?: (page: T, browserType: BrowserTypes) => void;
  actions?: Action;
}

export interface ScreenshotInfo {
  buffer: Buffer;
  browserName: BrowserTypes;
  base64?: string;
}

import { Page } from 'playwright-core';

export type BrowserTypes = 'chromium' | 'firefox' | 'webkit';

export interface PageInfo<T extends unknown = Page> {
  page: T;
  browserName: BrowserTypes;
}

export interface ScreenshotInfo {
  buffer: Buffer;
  browserName: BrowserTypes;
  base64?: string;
}

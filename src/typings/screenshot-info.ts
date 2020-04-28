import { Page } from 'playwright-core';
import { StoryActions } from './story-action';

export type BrowserTypes = 'chromium' | 'firefox' | 'webkit';

export interface PageInfo<T extends unknown = Page> {
  page: T;
  browserName: BrowserTypes;
}

export interface SetupSnapHelper<T extends unknown = Page> {
  storybookEndpoint?: string;
  getPage: (browserType: BrowserTypes) => Promise<T>;
  beforeSnapshot?: (page: T, browserType: BrowserTypes) => void;
  afterSnapshot?: (page: T, browserType: BrowserTypes) => void;
  actions?: StoryActions;
}

export interface ScreenshotInfo {
  buffer: Buffer;
  browserName: BrowserTypes;
  base64?: string;
}

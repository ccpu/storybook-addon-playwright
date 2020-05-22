import { Page } from 'playwright-core';
import { KnobStore } from './knobs';
import { StoryAction } from './story-action';
import { StoryInfo } from './story-info';

export type BrowserTypes = 'chromium' | 'firefox' | 'webkit';

export interface PageInfo<T extends unknown = Page> {
  page: T;
  browserName: BrowserTypes;
}

export interface ScreenshotImageData {
  buffer: Buffer;
  browserName: BrowserTypes;
  base64?: string;
}

export interface ScreenshotInfo extends StoryInfo {
  hash: string;
}

export interface ScreenshotData {
  knobs?: KnobStore;
  actions?: StoryAction[];
  browserType: BrowserTypes;
  title: string;
  hash: string;
  clip?: {
    width: number;
    height: number;
    x?: number;
    y?: number;
  };
}

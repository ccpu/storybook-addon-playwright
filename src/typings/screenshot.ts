import { Page } from 'playwright-core';
import { StoryAction } from './story-action';
import { StoryInfo } from './story-info';

export type BrowserTypes = 'chromium' | 'firefox' | 'webkit';

export interface DeviceDescriptor {
  name: string;
  viewport?: {
    width: number;
    height: number;
  };
  userAgent?: string;
  deviceScaleFactor?: number;
  isMobile?: boolean;
  hasTouch?: boolean;
}

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
  props?: ScreenshotProp[];
  actions?: StoryAction[];
  browserType: BrowserTypes;
  title: string;
  hash: string;
  device?: DeviceDescriptor;
  index?: number;
  clip?: {
    width: number;
    height: number;
    x?: number;
    y?: number;
  };
}

export interface ScreenshotProp {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

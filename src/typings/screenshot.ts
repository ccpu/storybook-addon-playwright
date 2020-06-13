import { Page } from 'playwright-core';
import { StoryAction } from './story-action';
import { StoryInfo } from './story-info';

export type BrowserTypes = 'chromium' | 'firefox' | 'webkit';

type PageScreenshotOptions = Parameters<Page['screenshot']>[0];

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
  options?: ScreenshotOptions;
}

export interface ScreenshotClip {
  width: number;
  height: number;
  x?: number;
  y?: number;
}

export type ScreenshotOptions = PageScreenshotOptions;

export interface ScreenshotData extends ScreenshotOptions {
  title: string;
  browserType: BrowserTypes;
  props?: ScreenshotProp[];
  actions?: StoryAction[];
  hash: string;
  device?: DeviceDescriptor;
  index?: number;
  options?: ScreenshotOptions;
}

export interface ScreenshotProp {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

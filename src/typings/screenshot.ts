import { Page } from 'playwright-core';
import { StoryAction } from './story-action';
import { StoryInfo } from './story-info';

export type BrowserTypes = 'chromium' | 'firefox' | 'webkit';

type PageScreenshotOptions = Parameters<Page['screenshot']>[0];

export interface ScreenshotOptions extends PageScreenshotOptions {
  cursor?: boolean;
}

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

export interface ScreenshotClip {
  width: number;
  height: number;
  x?: number;
  y?: number;
}

export interface ScreenshotSetting {
  browserType: BrowserTypes;
  props?: ScreenshotProp[];
  actions?: StoryAction[];
  device?: DeviceDescriptor;
  options?: ScreenshotOptions;
}

export interface ScreenshotData extends ScreenshotOptions, ScreenshotSetting {
  title: string;
  hash: string;
  index?: number;
}

export interface ScreenshotProp {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

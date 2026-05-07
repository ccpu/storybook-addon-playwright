import type {
  Page,
  BrowserContextOptions as PlaywrightBrowserContextOptions,
} from 'playwright';
import type { ScreenshotSettingInput, StoryInfo } from '../schema';

export type BrowserTypes = 'chromium' | 'firefox' | 'webkit';

type PageScreenshotOptions = Parameters<Page['screenshot']>[0];

export type ScreenshotOptions = PageScreenshotOptions;

export interface BrowserContextOptions extends PlaywrightBrowserContextOptions {
  cursor?: boolean;
  deviceName?: string;
}

export interface PageInfo<T = Page> {
  page: T;
  browserName: BrowserTypes;
}

export interface ScreenshotImageData {
  buffer: Buffer;
  browserName: BrowserTypes;
  base64?: string;
}

export interface ScreenshotInfo extends StoryInfo {
  screenshotId: string;
}

export interface ScreenshotClip {
  width: number;
  height: number;
  x?: number;
  y?: number;
}

export type ScreenshotSetting = ScreenshotSettingInput;

export interface ScreenshotData extends ScreenshotSetting {
  title: string;
  id: string;
  index?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ScreenshotProp {
  [prop: string]: any;
}

export type ScreenshotTestTargetType = 'file' | 'story' | 'all' | 'story-screenshot';

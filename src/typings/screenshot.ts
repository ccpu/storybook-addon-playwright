import { Page } from 'playwright-core';
import { KnobStoreKnob } from './knobs';
import { StoryAction } from './story-action';
import { StoryInfo } from './story-info';
import { ImageDiffResult } from '../api/typings';

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
  knobs?: KnobStoreKnob[];
  actions?: StoryAction[];
  browserType: BrowserTypes;
  title: string;
  hash: string;
  device?: DeviceDescriptor;
  imageDiffResult?: ImageDiffResult;
  clip?: {
    width: number;
    height: number;
    x?: number;
    y?: number;
  };
}

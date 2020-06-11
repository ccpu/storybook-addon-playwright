import { ScreenshotProp, ScreenshotOptions } from '../../typings';
import { StoryAction } from '../../typings/story-action';
import {
  BrowserTypes,
  ScreenshotData,
  StoryInfo,
  DeviceDescriptor,
  ScreenshotInfo,
} from '../../typings';

export interface GetScreenshotRequest {
  props?: ScreenshotProp[];
  actions?: StoryAction[];
  storyId: string;
  browserType: BrowserTypes;
  device?: DeviceDescriptor;
  options?: ScreenshotOptions;
}

export type GetScreenshotResponse = {
  base64: string;
  error: string;
  hash: string;
};

export interface SaveScreenshotRequest extends ScreenshotData, StoryInfo {
  base64?: string;
  hash: string;
  device?: DeviceDescriptor;
  updateScreenshot?: ScreenshotData;
  options: ScreenshotOptions;
}

export interface UpdateScreenshot extends ScreenshotInfo {
  base64?: string;
}

export interface ChangeScreenshotIndex extends StoryInfo {
  oldIndex: number;
  newIndex: number;
}

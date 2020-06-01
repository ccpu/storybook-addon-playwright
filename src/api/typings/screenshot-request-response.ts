import { KnobStoreKnob } from '../../typings/knobs';
import { StoryAction } from '../../typings/story-action';
import {
  BrowserTypes,
  ScreenshotData,
  StoryInfo,
  DeviceDescriptor,
  ScreenshotInfo,
} from '../../typings';

export interface GetScreenshotRequest {
  knobs?: KnobStoreKnob[];
  actions?: StoryAction[];
  storyId: string;
  browserType: BrowserTypes;
  device?: DeviceDescriptor;
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
}

export interface UpdateScreenshot extends ScreenshotInfo {
  base64?: string;
}

export interface ChangeScreenshotIndex extends StoryInfo {
  oldIndex: number;
  newIndex: number;
}

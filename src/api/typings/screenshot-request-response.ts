import { ScreenshotSetting } from '../../typings';

import { ScreenshotData, StoryInfo, ScreenshotInfo } from '../../typings';

export interface GetScreenshotRequest extends ScreenshotSetting {
  storyId: string;
}

export type GetScreenshotResponse = {
  base64: string;
  error: string;
  hash: string;
};

export interface SaveScreenshotRequest extends ScreenshotData, StoryInfo {
  base64?: string;
  hash: string;
  updateScreenshot?: ScreenshotData;
}

export interface UpdateScreenshot extends ScreenshotInfo {
  base64?: string;
}

export interface ChangeScreenshotIndex extends StoryInfo {
  oldIndex: number;
  newIndex: number;
}

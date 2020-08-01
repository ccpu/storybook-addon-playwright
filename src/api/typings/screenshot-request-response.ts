import { ScreenshotSetting } from '../../typings';

import { ScreenshotData, StoryInfo, ScreenshotInfo } from '../../typings';
import { RequestData } from '../../typings/request';

export interface ScreenshotRequest extends ScreenshotSetting, RequestData {
  storyId: string;
}

export type GetScreenshotResponse = {
  base64: string;
  error: string;
  id: string;
};

export interface SaveScreenshotRequest extends ScreenshotData, StoryInfo {
  base64?: string;
  id: string;
  updateScreenshot?: ScreenshotData;
}

export interface UpdateScreenshot extends ScreenshotInfo {
  base64?: string;
}

export interface ChangeScreenshotIndex extends StoryInfo {
  oldIndex: number;
  newIndex: number;
}

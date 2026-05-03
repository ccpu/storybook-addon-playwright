import { ScreenshotSetting } from '../../typings';

import { ScreenshotData, ScreenshotInfo } from '../../typings';
import { RequestData } from '../../typings/request';
import { StoryInfo } from '../../schema';

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

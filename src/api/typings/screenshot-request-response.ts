import type { StoryInfo } from '../../schema';

import type { ScreenshotData, ScreenshotInfo, ScreenshotSetting } from '../../typings';
import type { RequestData } from '../../typings/request';

export interface ScreenshotRequest extends ScreenshotSetting, RequestData {
  storyId: string;
}

export interface GetScreenshotResponse {
  base64: string;
  error: string;
  id: string;
}

export interface SaveScreenshotRequest extends ScreenshotData, StoryInfo {
  base64?: string;
  id: string;
  updateScreenshot?: ScreenshotData;
}

export interface UpdateScreenshot extends ScreenshotInfo {
  base64?: string;
}

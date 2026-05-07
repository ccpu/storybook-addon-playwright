import type { StoryInfo } from '../../schema';
import type { ScreenshotTestTargetType } from '../../typings';
import type { RequestData } from '../../typings/request';

export interface TestScreenShots extends RequestData, StoryInfo {
  requestType: ScreenshotTestTargetType;
}

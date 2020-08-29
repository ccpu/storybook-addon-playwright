import { RequestData } from '../../typings/request';
import { StoryInfo, ScreenshotTestTargetType } from '../../typings';

export interface TestScreenShots extends RequestData, StoryInfo {
  requestType: ScreenshotTestTargetType;
}

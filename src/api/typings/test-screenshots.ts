import { RequestData } from '../../typings/request';
import { ScreenshotTestTargetType } from '../../typings';
import { StoryInfo } from '../../schema';

export interface TestScreenShots extends RequestData, StoryInfo {
  requestType: ScreenshotTestTargetType;
}

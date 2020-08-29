import { RequestData } from '../../typings/request';
import { StoryInfo, ScreenshotTestType } from '../../typings';

export interface TestScreenShots extends RequestData, StoryInfo {
  requestType: ScreenshotTestType;
}

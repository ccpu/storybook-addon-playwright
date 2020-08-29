import { ScreenshotTestTargetType } from './screenshot';

export interface RequestData {
  requestId: string;
  requestType?: ScreenshotTestTargetType;
}

import { RequestData } from '../../typings/request';

export interface TestScreenShots extends RequestData {
  fileName?: string;
  storyId?: string;
}

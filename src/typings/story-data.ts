import { ActionSet } from './story-action';
import { ScreenshotData } from './screenshot';

export interface StoryData {
  [storyId: string]: {
    actionSets?: ActionSet[];
    screenshots?: ScreenshotData[];
  };
}

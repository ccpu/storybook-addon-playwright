import { ActionSet } from './story-action';
import { ScreenshotData } from './screenshot';

export interface StoryPlaywrightData {
  [storyId: string]: {
    actionSets?: ActionSet[];
    screenshots?: ScreenshotData[];
  };
}

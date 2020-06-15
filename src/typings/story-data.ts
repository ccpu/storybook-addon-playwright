import { ActionSet } from './story-action';
import { ScreenshotData } from './screenshot';

export interface PlaywrightData {
  actionSets?: ActionSet[];
  screenshots?: ScreenshotData[];
}

export interface StoryPlaywrightData {
  [storyId: string]: PlaywrightData;
}

import type {
  BrowserContextOptions,
  ScreenshotData,
  ScreenshotOptions,
} from './screenshot';
import type { ActionSet } from './story-action';

export interface PlaywrightStoryData {
  actionSets?: ActionSet[];
  screenshots?: ScreenshotData[];
}

export interface StoryBrowserOptions {
  [id: string]: BrowserContextOptions;
}
export interface StoryScreenshotOptions {
  [id: string]: ScreenshotOptions;
}
export interface PlaywrightDataStories {
  [id: string]: PlaywrightStoryData;
}

export interface StoryOptions {
  browserOptions?: StoryBrowserOptions;
  screenshotOptions?: StoryScreenshotOptions;
}

export interface PlaywrightData extends StoryOptions {
  stories?: PlaywrightDataStories;
  version?: string;
}

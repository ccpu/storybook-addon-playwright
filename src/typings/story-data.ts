import { ActionSet } from './story-action';
import {
  ScreenshotData,
  BrowserContextOptions,
  ScreenshotOptions,
} from './screenshot';

export interface PlaywrightStoryData {
  actionSets?: ActionSet[];
  screenshots?: ScreenshotData[];
}

export type StoryBrowserOptions = { [id: string]: BrowserContextOptions };
export type StoryScreenshotOptions = { [id: string]: ScreenshotOptions };
export type PlaywrightDataStories = { [id: string]: PlaywrightStoryData };

export interface StoryOptions {
  browserOptions?: StoryBrowserOptions;
  screenshotOptions?: StoryScreenshotOptions;
}

export interface PlaywrightData extends StoryOptions {
  stories?: PlaywrightDataStories;
  version?: string;
}

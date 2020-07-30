import { ActionSet } from './story-action';
import {
  ScreenshotData,
  BrowserContextOptions,
  ScreenshotOptions,
} from './screenshot';

export interface PlaywrightData {
  actionSets?: ActionSet[];
  screenshots?: ScreenshotData[];
}

export type StoryBrowserOptions = { [id: string]: BrowserContextOptions };
export type StoryScreenshotOptions = { [id: string]: ScreenshotOptions };
type Stories = { [id: string]: PlaywrightData };

export interface StoryOptions {
  browserOptions?: StoryBrowserOptions;
  screenshotOptions?: StoryScreenshotOptions;
}

export interface StoryPlaywrightData extends StoryOptions {
  stories?: Stories;
}

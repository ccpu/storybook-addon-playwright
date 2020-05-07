import { KnobStore } from './knobs';
import { StoryAction } from './story-action';
import { BrowserTypes } from '.';

// export type StoryInput = StoriesRaw[''];

export interface GetScreenshotRequest {
  knobs?: KnobStore;
  actions?: StoryAction[];
  storyId: string;
  browserType: BrowserTypes;
}

export type GetScreenshotResponse = {
  base64: string;
  error: string;
};

export interface SaveScreenshot {
  base64: string;
  description: string;
  browserType: BrowserTypes;
}

import { KnobStore } from '../../typings/knobs';
import { StoryAction } from '../../typings/story-action';
import { BrowserTypes } from '../../typings';

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

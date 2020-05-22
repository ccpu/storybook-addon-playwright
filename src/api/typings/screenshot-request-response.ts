import { KnobStore } from '../../typings/knobs';
import { StoryAction } from '../../typings/story-action';
import { BrowserTypes, ScreenshotData, StoryInfo } from '../../typings';

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

export interface SaveScreenshotRequest extends ScreenshotData, StoryInfo {
  base64: string;
  hash: string;
}

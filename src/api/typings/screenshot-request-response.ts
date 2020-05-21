import { KnobStore } from '../../typings/knobs';
import { StoryAction } from '../../typings/story-action';
import { BrowserTypes, ScreenshotData } from '../../typings';

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

export interface StoryScreenshotInfo {
  storyId: string;
  fileName: string;
}

export interface SaveScreenshotRequest
  extends ScreenshotData,
    StoryScreenshotInfo {
  base64: string;
  hash: string;
}

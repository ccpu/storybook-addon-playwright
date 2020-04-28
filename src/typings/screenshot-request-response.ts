import { KnobStore } from './knobs';
// import { StoriesRaw } from '@storybook/api/dist/modules/stories';
import { BrowserTypes } from '.';

// export type StoryInput = StoriesRaw[''];

export interface GetScreenshotRequest {
  knobs?: KnobStore;
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

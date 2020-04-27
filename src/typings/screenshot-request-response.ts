import { KnobStore } from './knobs';
// import { StoriesRaw } from '@storybook/api/dist/modules/stories';
import { BrowserTypes } from '.';

// export type StoryInput = StoriesRaw[''];

export interface ScreenshotRequestData {
  knobs?: KnobStore;
  storyId: string;
  browserType: BrowserTypes;
}

export type ScreenshotResponse = { base64: string; error: string };

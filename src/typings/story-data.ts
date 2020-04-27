import { KnobStore } from './knobs';
import { StoriesRaw } from '@storybook/api/dist/modules/stories';
import { BrowserTypes } from './snapshot-info';

export type StoryInput = StoriesRaw[''];

export interface StoryData {
  knobs?: KnobStore;
  storyId: string;
  browserTypes: BrowserTypes[];
}

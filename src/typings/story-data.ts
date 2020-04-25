import { KnobStore } from './knobs';
import { StoriesRaw } from '@storybook/api/dist/modules/stories';

export type StoryInput = StoriesRaw[''];

export interface StoryData {
  knobs?: KnobStore;
  data: StoryInput;
}

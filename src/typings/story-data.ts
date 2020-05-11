import { ActionSet } from './story-action';

export interface StoryData {
  [storyId: string]: {
    actionSets?: ActionSet[];
  };
}

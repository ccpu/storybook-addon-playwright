import sum from 'hash-sum';
import { StoryAction, KnobStore } from '../typings';

export const getSnapshotHash = (
  storyId: string,
  description: string,
  actions: StoryAction[],
  knobs: KnobStore,
) => {
  return sum({ actions, description, knobs, storyId });
};

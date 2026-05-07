import type { StoryInfo } from '../../schema';
import type { ActionSet } from '../../typings';

export interface SaveActionSetRequest extends StoryInfo {
  actionSet: ActionSet;
  storyId: string;
}

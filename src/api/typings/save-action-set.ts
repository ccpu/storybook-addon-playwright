import { ActionSet } from '../../typings';
import { StoryInfo } from '../../schema';

export interface SaveActionSetRequest extends StoryInfo {
  actionSet: ActionSet;
  storyId: string;
}

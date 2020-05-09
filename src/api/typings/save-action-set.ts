import { ActionSet, StoryInfo } from '../../typings';

export interface SaveActionSetRequest extends StoryInfo {
  actionSet: ActionSet;
}

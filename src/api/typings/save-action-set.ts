import { ActionSet } from '../../typings';

export interface SaveActionSetRequest {
  fileName: string;
  storyId: string;
  actionSet: ActionSet;
}

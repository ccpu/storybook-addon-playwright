import { StoryInfo } from '../../typings';

export interface DeleteActionSetRequest extends StoryInfo {
  actionSetId: string;
}

import type { StoryInfo } from '../../schema';

export interface DeleteActionSetRequest extends StoryInfo {
  actionSetId: string;
}

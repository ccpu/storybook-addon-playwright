import { RESET_STORY_ARGS } from '@storybook/core-events';
import { useStorybookApi } from '@storybook/manager-api';
import { useCurrentStoryData } from './use-current-story-data';
import {
  clearCurrentActionSets,
  deleteTempActionSets,
} from '../features/action-set/store/actions';

export const useResetSetting = () => {
  const api = useStorybookApi();

  const data = useCurrentStoryData();

  const reset = () => {
    api.emit(RESET_STORY_ARGS, { storyId: data?.id });
    clearCurrentActionSets();
    if (data?.id) {
      deleteTempActionSets(data.id);
    }
  };

  return reset;
};

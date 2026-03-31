import { RESET_STORY_ARGS } from '@storybook/core-events';
import { useStorybookApi } from '@storybook/manager-api';
import { useGlobalActionDispatch } from '../features/action-set/hooks/use-global-action-dispatch';
import { useCurrentStoryData } from './use-current-story-data';

export const useResetSetting = () => {
  const api = useStorybookApi();

  const { dispatch } = useGlobalActionDispatch();

  const data = useCurrentStoryData();

  const reset = () => {
    api.emit(RESET_STORY_ARGS, { storyId: data?.id });
    dispatch({ type: 'clearCurrentActionSets' });
    dispatch({ storyId: data.id, type: 'deleteTempActionSets' });
  };

  return reset;
};

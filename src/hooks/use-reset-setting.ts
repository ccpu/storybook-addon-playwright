import { RESET } from '@storybook/addon-knobs/dist/shared';
import { useStorybookApi } from '@storybook/api';
import { useGlobalActionDispatch } from './use-global-action-dispatch';
import { useCurrentStoryData } from './use-current-story-data';

export const useResetSetting = () => {
  const api = useStorybookApi();

  const { dispatch } = useGlobalActionDispatch();

  const data = useCurrentStoryData();

  const reset = () => {
    api.emit(RESET);
    dispatch({ type: 'clearCurrentActionSets' });
    dispatch({ storyId: data.id, type: 'deleteTempActionSets' });
  };

  return reset;
};

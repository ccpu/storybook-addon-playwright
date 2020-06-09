import { RESET } from '@storybook/addon-knobs/dist/shared';
import { useStorybookApi } from '@storybook/api';
import { useGlobalActionDispatch } from './use-global-action-dispatch';

export const useResetSetting = () => {
  const api = useStorybookApi();

  const { dispatch } = useGlobalActionDispatch();

  const reset = () => {
    api.emit(RESET);
    dispatch({ type: 'clearCurrentActionSets' });
  };

  return reset;
};

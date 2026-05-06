import { RESET_STORY_ARGS } from '@storybook/core-events';
import { useStorybookApi } from '@storybook/manager-api';
import { useCurrentStoryData } from './use-current-story-data';
import {
  clearCurrentActionSets,
  deleteTempActionSets,
} from '../features/action-set/store/actions';
import { useAddonState } from './use-addon-state';

export const PREVIEW_PANEL_SIZE = 200;

export const useResetSetting = () => {
  const api = useStorybookApi();

  const data = useCurrentStoryData();

  const { addonState, setAddonState } = useAddonState();

  const reset = () => {
    setAddonState({
      ...addonState,
      placement: 'auto',
      previewPanelEnabled: true,
      previewPanelSize: PREVIEW_PANEL_SIZE,
    });
    api.emit(RESET_STORY_ARGS, { storyId: data?.id });
    clearCurrentActionSets();
    if (data?.id) {
      deleteTempActionSets(data.id);
    }
  };

  return reset;
};

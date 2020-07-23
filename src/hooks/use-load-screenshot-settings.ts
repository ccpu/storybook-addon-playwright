import { useGlobalActionDispatch } from './use-global-action-dispatch';
import { useStorybookApi } from '@storybook/api';
import { useCallback } from 'react';
import { ScreenshotData } from '../typings';
import { RESET, CHANGE } from '@storybook/addon-knobs/dist/shared';
import { useCurrentStoryData } from './use-current-story-data';

export const useLoadScreenshotSettings = () => {
  const { dispatch } = useGlobalActionDispatch();

  const api = useStorybookApi();

  const storyData = useCurrentStoryData();

  const dispatchActions = useCallback(
    (screenshotData: ScreenshotData) => {
      if (!screenshotData.actions || !screenshotData.actions.length) return;
      dispatch({
        actionSet: {
          actions: screenshotData.actions,
          description: screenshotData.title + '- actions',
          id: screenshotData.hash,
          temp: true,
        },
        selected: true,
        storyId: storyData.id,
        type: 'addActionSet',
      });
    },
    [dispatch, storyData],
  );
  const loadSetting = useCallback(
    (screenshotData: ScreenshotData) => {
      api.emit(RESET);
      if (screenshotData.props) {
        screenshotData.props.forEach((prop) => {
          api.emit(CHANGE, prop);
        });
      }
      dispatchActions(screenshotData);
    },
    [api, dispatchActions],
  );

  return { loadSetting };
};

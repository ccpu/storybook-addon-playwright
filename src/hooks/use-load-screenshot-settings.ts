import { useGlobalActionDispatch } from './use-global-action-dispatch';
import { useStorybookApi } from '@storybook/api';
import { useCallback } from 'react';
import { ScreenshotData, ScreenshotOptions } from '../typings';
import { RESET, CHANGE } from '@storybook/addon-knobs/dist/shared';
import { useCurrentStoryData } from './use-current-story-data';
import { useBrowserOptions, BrowsersOption } from './use-browser-options';
import { useScreenshotOptions } from './use-screenshot-options';
import { BrowserContextOptions } from 'playwright-core';

interface ReturnType {
  browserOptions: BrowsersOption;
  loadSetting: (screenshotData: ScreenshotData, force?: boolean) => void;
  screenshotOptions: ScreenshotOptions;
}
export const useLoadScreenshotSettings = (): ReturnType => {
  const { dispatch } = useGlobalActionDispatch();

  const { setBrowserOptions, browserOptions } = useBrowserOptions();
  const { setScreenshotOptions, screenshotOptions } = useScreenshotOptions();

  const api = useStorybookApi();

  const storyData = useCurrentStoryData();

  const dispatchActions = useCallback(
    (screenshotData: ScreenshotData) => {
      if (!screenshotData.actions || !screenshotData.actions.length) return;
      dispatch({
        actionSet: {
          actions: screenshotData.actions,
          description: screenshotData.title + '- actions',
          id: screenshotData.id,
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
    (screenshotData: ScreenshotData, force = false) => {
      api.emit(RESET);
      if (screenshotData.props) {
        screenshotData.props.forEach((prop) => {
          api.emit(CHANGE, prop);
        });
      }
      dispatchActions(screenshotData);
      if (screenshotData.browserOptions || force) {
        setBrowserOptions(
          'all',
          screenshotData.browserOptions as BrowserContextOptions,
        );
      }
      if (screenshotData.screenshotOptions || force) {
        setScreenshotOptions(screenshotData.screenshotOptions);
      }
    },
    [api, dispatchActions, setBrowserOptions, setScreenshotOptions],
  );

  return { browserOptions, loadSetting, screenshotOptions };
};

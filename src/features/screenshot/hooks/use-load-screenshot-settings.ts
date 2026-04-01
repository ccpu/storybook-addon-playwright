import { useGlobalActionDispatch } from '../../action-set/hooks/use-global-action-dispatch';
import { useStorybookApi } from '@storybook/manager-api';
import { useCallback } from 'react';
import { ScreenshotData, ScreenshotOptions } from '../../../typings';
import { RESET_STORY_ARGS, UPDATE_STORY_ARGS } from '@storybook/core-events';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import {
  useBrowserOptions,
  BrowsersOption,
} from '../../../hooks/use-browser-options';
import { useScreenshotOptions } from './use-screenshot-options';
import { BrowserContextOptions } from 'playwright';

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
      if (!screenshotData.actionSets || !screenshotData.actionSets.length)
        return;
      dispatch({
        actionSets: screenshotData.actionSets,
        storyId: storyData.id,
        type: 'setScreenShotActionSets',
      });
    },
    [dispatch, storyData],
  );
  const loadSetting = useCallback(
    (screenshotData: ScreenshotData, force = false) => {
      api.emit(RESET_STORY_ARGS, { storyId: storyData?.id });
      if (screenshotData.props && Object.keys(screenshotData.props).length) {
        api.emit(UPDATE_STORY_ARGS, {
          storyId: storyData?.id,
          updatedArgs: screenshotData.props,
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

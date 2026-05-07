import type { BrowserContextOptions } from 'playwright';
import type { BrowsersOption } from '../../../hooks/use-browser-options';
import type { ScreenshotData, ScreenshotOptions } from '../../../typings';
import { RESET_STORY_ARGS, UPDATE_STORY_ARGS } from '@storybook/core-events';
import { useStorybookApi } from '@storybook/manager-api';
import { useCallback } from 'react';
import { useBrowserOptions } from '../../../hooks/use-browser-options';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { getScreenshotArgs } from '../../../utils';
import { setScreenShotActionSets } from '../../action-set/store/actions';
import { useScreenshotOptions } from './use-screenshot-options';

interface ReturnType {
  browserOptions: BrowsersOption;
  loadSetting: (screenshotData: ScreenshotData, force?: boolean) => void;
  screenshotOptions: ScreenshotOptions;
}

export function useLoadScreenshotSettings(): ReturnType {
  const { setBrowserOptions, browserOptions } = useBrowserOptions();
  const { setScreenshotOptions, screenshotOptions } = useScreenshotOptions();

  const api = useStorybookApi();

  const storyData = useCurrentStoryData();

  const dispatchActions = useCallback(
    (screenshotData: ScreenshotData) => {
      if (!storyData) return;

      if (!screenshotData.actionSets || !screenshotData.actionSets.length) return;
      setScreenShotActionSets({
        actionSets: screenshotData.actionSets,
        storyId: storyData.id,
      });
    },
    [storyData],
  );
  const loadSetting = useCallback(
    (screenshotData: ScreenshotData, force = false) => {
      if (!storyData) return;

      api.emit(RESET_STORY_ARGS, { storyId: storyData?.id });
      const args = getScreenshotArgs(screenshotData);
      if (args && Object.keys(args).length) {
        api.emit(UPDATE_STORY_ARGS, {
          storyId: storyData?.id,
          updatedArgs: args,
        });
      }
      dispatchActions(screenshotData);
      if (screenshotData.browserOptions || force) {
        setBrowserOptions('all', screenshotData.browserOptions as BrowserContextOptions);
      }
      if (screenshotData.screenshotOptions || force) {
        setScreenshotOptions(screenshotData.screenshotOptions);
      }
    },
    [api, dispatchActions, setBrowserOptions, setScreenshotOptions, storyData],
  );

  return { browserOptions, loadSetting, screenshotOptions };
}

import {
  useEditScreenshotStateValue,
  setEditScreenshotState,
} from '../../../store';
import { ScreenshotData, BrowserTypes } from '../../../typings';
import { useCallback, useEffect, useRef } from 'react';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { useStorybookApi } from '@storybook/manager-api';
import {
  deleteTempActionSets,
  clearCurrentActionSets,
} from '../../action-set/store/actions';
import { RESET_STORY_ARGS } from '@storybook/core-events';
import { useActiveBrowsers } from '../../../hooks/use-active-browser';
import { useLoadScreenshotSettings } from './use-load-screenshot-settings';
import { useAddonState } from '../../../hooks/use-addon-state';

export type { EditScreenshotState } from '../../../store';

export const useEditScreenshot = () => {
  const editScreenshotState = useEditScreenshotStateValue();

  const storyData = useCurrentStoryData();

  const { setAddonState, addonState } = useAddonState();

  const { setBrowserState } = useActiveBrowsers('dialog');

  const { loadSetting, screenshotOptions, browserOptions } =
    useLoadScreenshotSettings();

  const unmounted = useRef<boolean>(false);

  const api = useStorybookApi();

  const clearScreenshotEdit = useCallback(() => {
    if (storyData?.id) {
      deleteTempActionSets(storyData.id);
    }

    clearCurrentActionSets();

    api.emit(RESET_STORY_ARGS, { storyId: storyData?.id });

    if (editScreenshotState) {
      loadSetting(
        {
          browserOptions: editScreenshotState.currentBrowserOptions,
          browserType: editScreenshotState.screenshotData.browserType,
          id: editScreenshotState.screenshotData.id,
          screenshotOptions: editScreenshotState.currentScreenshotOptions,
          title: editScreenshotState.screenshotData.title,
        },
        true,
      );
    }
    if (!unmounted.current) {
      setEditScreenshotState(undefined);
    }
  }, [api, editScreenshotState, loadSetting, storyData]);

  const editScreenshot = useCallback(
    (screenshotData: ScreenshotData) => {
      if (!storyData) return;

      clearScreenshotEdit();
      setEditScreenshotState({
        currentBrowserOptions: browserOptions.all,
        currentScreenshotOptions: screenshotOptions,
        screenshotData,
        storyId: storyData.id,
      });
      loadSetting(screenshotData);
      setBrowserState(screenshotData.browserType, 'main', false);
      if (!addonState.previewPanelEnabled) {
        setAddonState({
          ...addonState,
          previewPanelEnabled: true,
        });
      }
    },
    [
      addonState,
      browserOptions.all,
      clearScreenshotEdit,
      loadSetting,
      screenshotOptions,
      setAddonState,
      setBrowserState,
      storyData,
    ],
  );

  const isEditing = useCallback(
    (browser: BrowserTypes) => {
      if (!editScreenshotState) return false;

      return editScreenshotState.screenshotData.browserType === browser;
    },
    [editScreenshotState],
  );

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  useEffect(() => {
    if (!editScreenshotState || !storyData) return undefined;

    if (editScreenshotState.storyId !== storyData.id) {
      clearScreenshotEdit();
      return undefined;
    }
  }, [clearScreenshotEdit, editScreenshotState, storyData]);

  return {
    clearScreenshotEdit,
    editScreenshot,
    editScreenshotState,
    isEditing,
    loadSetting,
  };
};

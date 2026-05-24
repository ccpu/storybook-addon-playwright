import type { BrowserTypes, ScreenshotData } from '../../../typings';
import { RESET_STORY_ARGS } from '@storybook/core-events';
import { useStorybookApi } from '@storybook/manager-api';
import { useCallback, useEffect, useRef } from 'react';
import { ACTIONS_PANEL_ID } from '../../../constants';
import { useBrowserStateManager } from '../../../hooks/use-browser-state-manager';
import { useAddonState } from '../../../hooks/use-addon-state';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { setEditScreenshotState, useEditScreenshotStateValue } from '../../../store';
import {
  clearCurrentActionSets,
  deleteTempActionSets,
} from '../../action-set/store/actions';
import { useLoadScreenshotSettings } from './use-load-screenshot-settings';

export type { EditScreenshotState } from '../../../store';

export function useEditScreenshot() {
  const editScreenshotState = useEditScreenshotStateValue();

  const storyData = useCurrentStoryData();

  const { setAddonState, addonState } = useAddonState();

  const { setBrowserState } = useBrowserStateManager('dialog');

  const { loadSetting, screenshotOptions, browserOptions } = useLoadScreenshotSettings();

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

      api.setSelectedPanel(ACTIONS_PANEL_ID);
    },
    [
      addonState,
      api,
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

  useEffect(
    () => () => {
      unmounted.current = true;
    },
    [],
  );

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
}

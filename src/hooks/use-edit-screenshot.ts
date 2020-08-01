import { useGlobalState } from './use-global-state';
import { ScreenshotData, BrowserTypes, ScreenshotOptions } from '../typings';
import { useCallback, useEffect, useRef } from 'react';
import { useCurrentStoryData } from './use-current-story-data';
import { useStorybookApi } from '@storybook/api';
import { useGlobalActionDispatch } from './use-global-action-dispatch';
import { RESET } from '@storybook/addon-knobs/dist/shared';
import { useActiveBrowsers } from './use-active-browser';
import { useLoadScreenshotSettings } from './use-load-screenshot-settings';
import { useAddonState } from './use-addon-state';
import { BrowserContextOptions } from 'playwright-core';

interface EditScreenshotState {
  storyId: string;
  screenshotData: ScreenshotData;
  currentScreenshotOptions?: ScreenshotOptions;
  currentBrowserOptions?: BrowserContextOptions;
}

export const useEditScreenshot = () => {
  const [editScreenshotState, setEditScreenshotState] = useGlobalState<
    EditScreenshotState
  >('edit-story-screenshot', undefined);

  const storyData = useCurrentStoryData();

  const { setAddonState, addonState } = useAddonState();

  const { setBrowserState } = useActiveBrowsers('dialog');

  const {
    loadSetting,
    screenshotOptions,
    browserOptions,
  } = useLoadScreenshotSettings();

  const { dispatch } = useGlobalActionDispatch();

  const unmounted = useRef<boolean>(false);

  const api = useStorybookApi();

  const clearScreenshotEdit = useCallback(() => {
    dispatch({
      actionSetId: editScreenshotState.screenshotData.id,
      clearCurrentActionSets: true,
      storyId: storyData.id,
      type: 'deleteActionSet',
    });
    api.emit(RESET);

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
    if (!unmounted.current) {
      setEditScreenshotState(undefined);
    }
  }, [
    api,
    dispatch,
    editScreenshotState,
    loadSetting,
    setEditScreenshotState,
    storyData,
  ]);

  const editScreenshot = useCallback(
    (screenshotData: ScreenshotData) => {
      if (editScreenshotState) {
        clearScreenshotEdit();
      }
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
      editScreenshotState,
      loadSetting,
      screenshotOptions,
      setAddonState,
      setBrowserState,
      setEditScreenshotState,
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
  }, [
    clearScreenshotEdit,
    editScreenshotState,
    setEditScreenshotState,
    storyData,
  ]);

  return {
    clearScreenshotEdit,
    editScreenshot,
    editScreenshotState,
    isEditing,
    loadSetting,
  };
};

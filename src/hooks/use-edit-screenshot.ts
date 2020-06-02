import { useGlobalState } from './use-global-state';
import { ScreenshotData, BrowserTypes } from '../typings';
import { useCallback, useEffect } from 'react';
import { useCurrentStoryData } from './use-current-story-data';
import { useStorybookApi } from '@storybook/api';
import { useGlobalActionDispatch } from './use-global-action-dispatch';
import { RESET } from '@storybook/addon-knobs';
import { useActiveBrowsers } from './use-active-browser';
import { useLoadScreenshotSettings } from './use-load-screenshot-settings';

interface EditScreenshotState {
  storyId: string;
  screenshotData: ScreenshotData;
}

export const useEditScreenshot = () => {
  const [editScreenshotState, setEditScreenshotState] = useGlobalState<
    EditScreenshotState
  >('edit-story-screenshot', undefined);

  const storyData = useCurrentStoryData();

  const { setBrowserState } = useActiveBrowsers('dialog');

  const { loadSetting } = useLoadScreenshotSettings();

  const { dispatch } = useGlobalActionDispatch();

  const api = useStorybookApi();

  const clearScreenshotEdit = useCallback(() => {
    dispatch({
      actionSetId: editScreenshotState.screenshotData.hash,
      storyId: storyData.id,
      type: 'deleteActionSet',
    });
    setEditScreenshotState(undefined);
    api.emit(RESET);
  }, [api, dispatch, editScreenshotState, setEditScreenshotState, storyData]);

  const editScreenshot = useCallback(
    (screenshotData: ScreenshotData) => {
      if (editScreenshotState) {
        clearScreenshotEdit();
      }
      setEditScreenshotState({ screenshotData, storyId: storyData.id });
      loadSetting(screenshotData);
      setBrowserState(screenshotData.browserType, 'main', false);
    },
    [
      clearScreenshotEdit,
      editScreenshotState,
      loadSetting,
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
    if (!editScreenshotState || !storyData) return;

    if (editScreenshotState.storyId !== storyData.id) {
      clearScreenshotEdit();
      return;
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

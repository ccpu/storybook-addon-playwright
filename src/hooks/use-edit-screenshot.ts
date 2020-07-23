import { useGlobalState } from './use-global-state';
import { ScreenshotData, BrowserTypes } from '../typings';
import { useCallback, useEffect, useRef } from 'react';
import { useCurrentStoryData } from './use-current-story-data';
import { useStorybookApi } from '@storybook/api';
import { useGlobalActionDispatch } from './use-global-action-dispatch';
import { RESET } from '@storybook/addon-knobs/dist/shared';
import { useActiveBrowsers } from './use-active-browser';
import { useLoadScreenshotSettings } from './use-load-screenshot-settings';
import { useAddonState } from './use-addon-state';

interface EditScreenshotState {
  storyId: string;
  screenshotData: ScreenshotData;
}

export const useEditScreenshot = () => {
  const [editScreenshotState, setEditScreenshotState] = useGlobalState<
    EditScreenshotState
  >('edit-story-screenshot', undefined);

  const storyData = useCurrentStoryData();

  const { setAddonState, addonState } = useAddonState();

  const { setBrowserState } = useActiveBrowsers('dialog');

  const { loadSetting } = useLoadScreenshotSettings();

  const { dispatch } = useGlobalActionDispatch();

  const unmounted = useRef<boolean>(false);

  const api = useStorybookApi();

  const clearScreenshotEdit = useCallback(() => {
    dispatch({
      actionSetId: editScreenshotState.screenshotData.hash,
      storyId: storyData.id,
      type: 'deleteActionSet',
    });
    api.emit(RESET);
    if (!unmounted.current) {
      setEditScreenshotState(undefined);
    }
  }, [api, dispatch, editScreenshotState, setEditScreenshotState, storyData]);

  const editScreenshot = useCallback(
    (screenshotData: ScreenshotData) => {
      dispatch({
        type: 'clearCurrentActionSets',
      });
      if (editScreenshotState) {
        clearScreenshotEdit();
      }
      setEditScreenshotState({ screenshotData, storyId: storyData.id });
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
      clearScreenshotEdit,
      dispatch,
      editScreenshotState,
      loadSetting,
      setAddonState,
      setBrowserState,
      setEditScreenshotState,
      storyData.id,
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

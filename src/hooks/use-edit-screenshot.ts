import { useGlobalState } from './use-global-state';
import { ScreenshotData, BrowserTypes } from '../typings';
import { useCallback, useEffect } from 'react';
import { useCurrentStoryData } from './use-current-story-data';
import { useStorybookApi } from '@storybook/api';
import { useGlobalActionDispatch } from './use-global-action-dispatch';
import { RESET, CHANGE } from '@storybook/addon-knobs';

interface EditScreenshotState {
  storyId: string;
  screenshotData: ScreenshotData;
  loaded?: boolean;
}

export const useEditScreenshot = () => {
  const [editScreenshotState, setEditScreenshotState] = useGlobalState<
    EditScreenshotState
  >('edit-story-screenshot', undefined);

  const storyData = useCurrentStoryData();

  const { dispatch } = useGlobalActionDispatch();

  const api = useStorybookApi();

  const dispatchActions = useCallback(
    (screenshotData: ScreenshotData) => {
      dispatch({
        actionSet: {
          actions: screenshotData.actions,
          description: screenshotData.title + ' actions',
          id: screenshotData.hash,
        },
        storyId: storyData.id,
        type: 'addActionSet',
      });
      dispatch({
        actionSetId: screenshotData.hash,
        type: 'toggleCurrentActionSet',
      });
    },
    [dispatch, storyData],
  );

  const editScreenshot = useCallback(
    (screenshotData: ScreenshotData) => {
      setEditScreenshotState({ screenshotData, storyId: storyData.id });
      api.emit(RESET);
      if (screenshotData.knobs) {
        screenshotData.knobs.forEach((knob) => {
          api.emit(CHANGE, knob);
        });
      }
      dispatchActions(screenshotData);
    },
    [api, dispatchActions, setEditScreenshotState, storyData],
  );

  const isEditing = useCallback(
    (browser: BrowserTypes) => {
      if (!editScreenshotState) return false;

      return editScreenshotState.screenshotData.browserType === browser;
    },
    [editScreenshotState],
  );

  const clearScreenshotEdit = useCallback(() => {
    setEditScreenshotState(undefined);
  }, [setEditScreenshotState]);

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
  };
};

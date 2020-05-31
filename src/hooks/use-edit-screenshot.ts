import { useGlobalState } from './use-global-state';
import { ScreenshotData } from '../typings';
import { useCallback, useEffect } from 'react';
import { knobsToQuerystring } from '../utils';
import { useCurrentStoryData } from './use-current-story-data';
import { useStorybookApi } from '@storybook/api';
import { useGlobalActionDispatch } from './use-global-action-dispatch';

interface EditScreenshotState {
  storyId: string;
  screenshotData: ScreenshotData;
  loaded?: boolean;
}
let __reloading = false;
let __actionsLoaded = false;
export const useEditScreenshot = () => {
  const [editScreenshotState, setEditScreenshotState] = useGlobalState<
    EditScreenshotState
  >('edit-story-screenshot111', undefined, true);

  const storyData = useCurrentStoryData();

  const { dispatch } = useGlobalActionDispatch();

  const api = useStorybookApi();

  const editScreenshot = useCallback(
    (screenshotData: ScreenshotData) => {
      __reloading = true;
      setEditScreenshotState({ screenshotData, storyId: storyData.id });
      let newUrl = window.location.href;
      if (screenshotData.knobs) {
        newUrl = `${window.location.href}&${knobsToQuerystring(
          screenshotData.knobs,
        )}`;
      }
      window.location.href = newUrl + '&editing-screenshot=true';
    },
    [setEditScreenshotState, storyData],
  );

  const isEditingScreenshot = useCallback(() => {
    return Boolean(api.getQueryParam('editing-screenshot'));
  }, [api]);

  const clearScreenshotEdit = useCallback(() => {
    setEditScreenshotState(undefined);
    __reloading = false;
    __actionsLoaded = false;
    if (isEditingScreenshot()) window.location.reload();
  }, [isEditingScreenshot, setEditScreenshotState]);

  useEffect(() => {
    if (__reloading || !editScreenshotState || !storyData) return;

    if (!isEditingScreenshot()) {
      setEditScreenshotState(undefined);
      return;
    }
    if (editScreenshotState.storyId !== storyData.id) {
      clearScreenshotEdit();
      return;
    }
    console.log('action');
    if (!__actionsLoaded && editScreenshotState.screenshotData.actions) {
      __actionsLoaded = true;
      setTimeout(() => {
        dispatch({
          actionSet: {
            actions: editScreenshotState.screenshotData.actions,
            description: editScreenshotState.screenshotData.title + ' actions',
            id: editScreenshotState.screenshotData.hash,
          },
          storyId: storyData.id,
          type: 'addActionSet',
        });
        dispatch({
          actionSetId: editScreenshotState.screenshotData.hash,
          type: 'toggleCurrentActionSet',
        });
      }, 2000);
    }
  }, [
    editScreenshotState,
    clearScreenshotEdit,
    storyData,
    api,
    setEditScreenshotState,
    isEditingScreenshot,
    dispatch,
  ]);

  return {
    clearScreenshotEdit,
    editScreenshot,
    editScreenshotState,
    isEditingScreenshot,
  };
};

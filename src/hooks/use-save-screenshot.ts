import { useCallback, useState } from 'react';
import { useKnobs } from './use-knobs';
import { useCurrentActions } from './use-current-actions';
import { useCurrentStoryData } from './use-current-story-data';
import { saveScreenshot as saveScreenshotClient } from '../api/client';
import { BrowserTypes, DeviceDescriptor } from '../typings';
import { getSnapshotHash } from '../utils';
import { SaveScreenshotRequest } from '../api/typings';
import { useGlobalScreenshotDispatch } from './use-global-screenshot-dispatch';
import { useAsyncApiCall } from './use-async-api-call';
import { useEditScreenshot } from './use-edit-screenshot';

export const useSaveScreenshot = () => {
  const knobs = useKnobs();
  const storyData = useCurrentStoryData();

  const { dispatch } = useGlobalScreenshotDispatch();

  const { editScreenshotState, clearScreenshotEdit } = useEditScreenshot();

  const { currentActions } = useCurrentActions(storyData && storyData.id);
  const [error, setError] = useState<string>();

  const [saving, setWorking] = useState(false);

  const {
    makeCall,
    result,
    clearError,
    clearResult,
    ErrorSnackbar,
  } = useAsyncApiCall(saveScreenshotClient);

  const isUpdating = useCallback(
    (browserType: BrowserTypes) => {
      if (!editScreenshotState) return false;
      if (editScreenshotState.screenshotData.browserType === browserType)
        return true;
      return false;
    },
    [editScreenshotState],
  );

  const getUpdatingScreenshot = useCallback(() => {
    return editScreenshotState && editScreenshotState.screenshotData.title;
  }, [editScreenshotState]);

  const saveScreenShot = useCallback(
    async (
      browserType: BrowserTypes,
      title: string,
      base64String?: string,
      deviceDescriptor?: DeviceDescriptor,
    ) => {
      const hash = getSnapshotHash(
        storyData.id,
        currentActions,
        knobs,
        browserType,
        deviceDescriptor,
      );

      try {
        const data: SaveScreenshotRequest = {
          actions: currentActions,
          base64: base64String,
          browserType,
          device: deviceDescriptor,
          fileName: storyData.parameters.fileName,
          hash,
          knobs: knobs,
          storyId: storyData.id,
          title,
          updateStringShotHash:
            isUpdating(browserType) && editScreenshotState.screenshotData.hash,
        };
        setWorking(true);
        const res = await makeCall(data);

        if (editScreenshotState && isUpdating(browserType)) {
          dispatch({
            screenshotHash: editScreenshotState.screenshotData.hash,
            type: 'removeScreenshot',
          });
        }

        if (!(res instanceof Error) && res.added) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { base64, ...rest } = data;
          dispatch({ screenshot: rest, type: 'addScreenshot' });
        }
      } catch (error) {
        setError(error.message);
      }
      setWorking(false);
    },
    [
      storyData,
      currentActions,
      knobs,
      editScreenshotState,
      makeCall,
      dispatch,
      isUpdating,
    ],
  );

  const onSuccessClose = useCallback(() => {
    clearResult();
    if (editScreenshotState) clearScreenshotEdit();
  }, [clearResult, clearScreenshotEdit, editScreenshotState]);

  return {
    ErrorSnackbar,
    clearError,
    error,
    getUpdatingScreenshot,
    isUpdating,
    onSuccessClose,
    result,
    saveScreenShot,
    saving,
  };
};

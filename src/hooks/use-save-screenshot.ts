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

  const { dispatch: screenshotDispatch } = useGlobalScreenshotDispatch();

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
          index: isUpdating(browserType)
            ? editScreenshotState.screenshotData.index
            : undefined,
          knobs: knobs,
          storyId: storyData.id,
          title,
          updateScreenshot:
            isUpdating(browserType) && editScreenshotState.screenshotData,
        };

        setWorking(true);

        const res = await makeCall(data);

        if (res instanceof Error) return;

        if (editScreenshotState && isUpdating(browserType)) {
          if (res.added) {
            screenshotDispatch({
              screenshotHash: editScreenshotState.screenshotData.hash,
              type: 'removeScreenshot',
            });
          }
          clearScreenshotEdit();
        }

        if (res.added) {
          data.index = res.index;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { base64, ...rest } = data;
          screenshotDispatch({
            screenshot: rest,
            type: 'addScreenshot',
          });
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
      isUpdating,
      editScreenshotState,
      makeCall,
      clearScreenshotEdit,
      screenshotDispatch,
    ],
  );

  const onSuccessClose = useCallback(() => {
    clearResult();
  }, [clearResult]);

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

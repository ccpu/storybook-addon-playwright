import { updateScreenshot as updateScreenshotClient } from '../api/client';
import { useAsyncApiCall } from './use-async-api-call';
import { useCallback } from 'react';
import { useCurrentStoryData } from './use-current-story-data';
import { useScreenshotDispatch } from '../store/screenshot';

export const useScreenshotUpdate = () => {
  const {
    makeCall,
    inProgress: updateScreenshotInProgress,
    clearResult: updateScreenshotClearResult,
    ErrorSnackbar: UpdateScreenshotErrorSnackbar,
    SuccessSnackbar: UpdateScreenshotSuccessSnackbar,
  } = useAsyncApiCall(updateScreenshotClient, false);

  const storyData = useCurrentStoryData();

  const dispatch = useScreenshotDispatch();

  const updateScreenshot = useCallback(
    async (screenshotHash: string, newScreenshot: string) => {
      await makeCall({
        base64: newScreenshot,
        fileName: storyData.parameters.fileName,
        hash: screenshotHash,
        storyId: storyData.id,
      });
      dispatch({ screenshotHash, type: 'removeImageDiffResult' });
    },
    [dispatch, storyData, makeCall],
  );

  return {
    UpdateScreenshotErrorSnackbar,
    UpdateScreenshotSuccessSnackbar,
    updateScreenshot,
    updateScreenshotClearResult,
    updateScreenshotInProgress,
  };
};

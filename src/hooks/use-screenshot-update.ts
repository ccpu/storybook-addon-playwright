import { updateScreenshot as updateScreenshotClient } from '../api/client';
import { useAsyncApiCall } from './use-async-api-call';
import { useCallback } from 'react';
import { useScreenshotDispatch } from '../store/screenshot';
import { ImageDiffResult } from '../api/typings';

export const useScreenshotUpdate = () => {
  const {
    makeCall,
    inProgress: updateScreenshotInProgress,
    clearResult: updateScreenshotClearResult,
    ErrorSnackbar: UpdateScreenshotErrorSnackbar,
    SuccessSnackbar: UpdateScreenshotSuccessSnackbar,
  } = useAsyncApiCall(updateScreenshotClient, false);

  const dispatch = useScreenshotDispatch();

  const updateScreenshot = useCallback(
    async (imageDiffResult: ImageDiffResult) => {
      const result = await makeCall({
        base64: imageDiffResult.newScreenshot,
        fileName: imageDiffResult.fileName,
        screenshotId: imageDiffResult.screenshotId,
        storyId: imageDiffResult.storyId,
      });

      if (result instanceof Error) return;

      const newImageDiffResult: ImageDiffResult = {
        diffSize: false,
        index: imageDiffResult.index,
        newScreenshot: imageDiffResult.newScreenshot,
        pass: true,
        screenshotId: imageDiffResult.screenshotId,
        storyId: imageDiffResult.storyId,
      };

      dispatch({
        imageDiffResult: newImageDiffResult,
        type: 'updateImageDiffResult',
      });
    },
    [dispatch, makeCall],
  );

  return {
    UpdateScreenshotErrorSnackbar,
    UpdateScreenshotSuccessSnackbar,
    updateScreenshot,
    updateScreenshotClearResult,
    updateScreenshotInProgress,
  };
};

import { updateScreenshot as updateScreenshotClient } from '../api/client';
import { useAsyncApiCall } from './use-async-api-call';
import { useCallback } from 'react';
import { useCurrentStoryData } from './use-current-story-data';
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

  const storyData = useCurrentStoryData();

  const dispatch = useScreenshotDispatch();

  const updateScreenshot = useCallback(
    async (imageDiffResult: ImageDiffResult) => {
      const result = await makeCall({
        base64: imageDiffResult.newScreenshot,
        fileName: storyData.parameters.fileName,
        hash: imageDiffResult.screenshotHash,
        storyId: storyData.id,
      });

      if (result instanceof Error) return;

      const newImageDiffResult: ImageDiffResult = {
        diffSize: false,
        index: imageDiffResult.index,
        newScreenshot: imageDiffResult.newScreenshot,
        pass: true,
        screenshotHash: imageDiffResult.screenshotHash,
        storyId: imageDiffResult.storyId,
      };

      dispatch({
        imageDiffResult: newImageDiffResult,
        type: 'updateImageDiffResult',
      });
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

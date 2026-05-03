import { updateScreenshot as updateScreenshotClient } from '../../../api/trpc/clients/screenshot.client';
import { useAsyncApiCall } from '../../../hooks/use-async-api-call';
import { useCallback } from 'react';
import { updateImageDiffResult } from '../store/index';
import { ImageDiffResult } from '../../../api/typings';

export const useScreenshotUpdate = (successMessage?: string) => {
  const {
    makeCall,
    inProgress: updateScreenshotInProgress,
    clearResult: updateScreenshotClearResult,
    ErrorSnackbar: UpdateScreenshotErrorSnackbar,
  } = useAsyncApiCall(updateScreenshotClient, false, {
    successMessage,
  });

  const updateScreenshot = useCallback(
    async (imageDiffResult: ImageDiffResult) => {
      console.log(imageDiffResult);
      const result = await makeCall({
        base64: imageDiffResult.newScreenshot,
        filePath: imageDiffResult.filePath,
        screenshotId: imageDiffResult.screenshotId,
        storyId: imageDiffResult.storyId,
      });

      if (result instanceof Error) return;

      const newImageDiffResult: ImageDiffResult = {
        diffSize: false,
        filePath: imageDiffResult.filePath,
        index: imageDiffResult.index,
        newScreenshot: imageDiffResult.newScreenshot,
        pass: true,
        screenshotId: imageDiffResult.screenshotId,
        storyId: imageDiffResult.storyId,
      };

      updateImageDiffResult(newImageDiffResult);
    },
    [makeCall],
  );

  return {
    UpdateScreenshotErrorSnackbar,
    updateScreenshot,
    updateScreenshotClearResult,
    updateScreenshotInProgress,
  };
};

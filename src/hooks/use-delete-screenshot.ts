import { useCallback } from 'react';
import { useCurrentStoryData } from './use-current-story-data';
import { deleteScreenshot as deleteScreenshotService } from '../api/client';
import { useScreenshotDispatch } from '../store/screenshot';
import { useAsyncApiCall } from './use-async-api-call';

export const useDeleteScreenshot = () => {
  const storyData = useCurrentStoryData();

  const dispatch = useScreenshotDispatch();

  const {
    clearError,
    error,
    inProgress,
    makeCall,
    ErrorSnackbar,
  } = useAsyncApiCall(deleteScreenshotService, false);

  const deleteScreenshot = useCallback(
    async (hash: string) => {
      const result = await makeCall({
        fileName: storyData.parameters.fileName,
        hash: hash,
        storyId: storyData.id,
      });
      console.log(result);
      if (!(result instanceof Error))
        dispatch({ screenshotHash: hash, type: 'deleteScreenshot' });
    },
    [dispatch, makeCall, storyData],
  );

  return { ErrorSnackbar, clearError, deleteScreenshot, error, inProgress };
};

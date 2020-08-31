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
  } = useAsyncApiCall(deleteScreenshotService, false, {
    successMessage: 'Screenshot deleted successfully.',
  });

  const deleteScreenshot = useCallback(
    async (id: string) => {
      const result = await makeCall({
        fileName: storyData.parameters.fileName,
        screenshotId: id,
        storyId: storyData.id,
      });

      if (!(result instanceof Error))
        dispatch({ screenshotId: id, type: 'deleteScreenshot' });
    },
    [dispatch, makeCall, storyData],
  );

  return {
    ErrorSnackbar,
    clearError,
    deleteScreenshot,
    error,
    inProgress,
  };
};

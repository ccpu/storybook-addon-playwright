import { deleteStoryScreenshots as deleteStoryScreenshotsClient } from '../../../api/trpc/clients/screenshot.client';
import { useAsyncApiCall } from '../../../hooks/use-async-api-call';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { useCallback } from 'react';
import { removeStoryScreenshots } from '../store/index';

export const useDeleteStoryScreenshot = () => {
  const {
    makeCall,
    ErrorSnackbar: DeleteScreenshotsErrorSnackbar,
    inProgress: deleteInProgress,
  } = useAsyncApiCall(deleteStoryScreenshotsClient, false, {
    successMessage: 'Story screenshots deleted successfully.',
  });

  const data = useCurrentStoryData();

  const deleteStoryScreenshots = useCallback(async () => {
    const result = await makeCall({
      fileName: data.fileName,
      storyId: data.id,
    });
    if (!(result instanceof Error)) {
      removeStoryScreenshots();
    }
  }, [data, makeCall]);

  return {
    DeleteScreenshotsErrorSnackbar,
    deleteInProgress,
    deleteStoryScreenshots,
  };
};

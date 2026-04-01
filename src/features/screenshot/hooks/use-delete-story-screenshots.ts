import { deleteStoryScreenshots as deleteStoryScreenshotsClient } from '../screenshot.client';
import { useAsyncApiCall } from '../../../hooks/use-async-api-call';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { useCallback } from 'react';
import { useScreenshotDispatch } from '../store/index';

export const useDeleteStoryScreenshot = () => {
  const {
    makeCall,
    ErrorSnackbar: DeleteScreenshotsErrorSnackbar,
    inProgress: deleteInProgress,
  } = useAsyncApiCall(deleteStoryScreenshotsClient, false, {
    successMessage: 'Story screenshots deleted successfully.',
  });

  const data = useCurrentStoryData();
  const dispatch = useScreenshotDispatch();

  const deleteStoryScreenshots = useCallback(async () => {
    const result = await makeCall({
      fileName: data.parameters.fileName,
      storyId: data.id,
    });
    if (!(result instanceof Error)) {
      dispatch({ type: 'removeStoryScreenshots' });
    }
  }, [data, makeCall, dispatch]);

  return {
    DeleteScreenshotsErrorSnackbar,
    deleteInProgress,
    deleteStoryScreenshots,
  };
};

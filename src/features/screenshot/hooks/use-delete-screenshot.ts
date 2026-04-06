import { useCallback } from 'react';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { deleteScreenshot as deleteScreenshotService } from '../../../api/trpc/clients/screenshot.client';
import { deleteScreenshot as deleteScreenshotFromStore } from '../store/index';
import { useAsyncApiCall } from '../../../hooks/use-async-api-call';

export const useDeleteScreenshot = () => {
  const storyData = useCurrentStoryData();

  const { clearError, error, inProgress, makeCall, ErrorSnackbar } =
    useAsyncApiCall(deleteScreenshotService, false, {
      successMessage: 'Screenshot deleted successfully.',
    });

  const deleteScreenshot = useCallback(
    async (id: string) => {
      const result = await makeCall({
        fileName: storyData.parameters.fileName,
        screenshotId: id,
        storyId: storyData.id,
      });

      if (!(result instanceof Error)) {
        deleteScreenshotFromStore(id);
      }
    },
    [makeCall, storyData],
  );

  return {
    ErrorSnackbar,
    clearError,
    deleteScreenshot,
    error,
    inProgress,
  };
};

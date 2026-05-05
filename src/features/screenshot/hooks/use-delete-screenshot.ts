import { useCallback } from 'react';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { trpcClient } from '../../../api/trpc/client';
import { deleteScreenshot as deleteScreenshotFromStore } from '../store/index';
import { toast } from '../../../utils/toast';
import { useState } from 'react';

export const useDeleteScreenshot = () => {
  const storyData = useCurrentStoryData();
  const [error, setError] = useState<string>();

  const {
    mutateAsync,
    reset,
    isPending: inProgress,
  } = trpcClient.screenshot.deleteScreenshot.useMutation({
    onError: (mutationError) => {
      const message = mutationError.message || 'Unexpected error occurred';
      setError(message);
      toast.error(message);
    },
    onSuccess: () => {
      toast.success('Screenshot deleted successfully.');
    },
  });

  const clearError = useCallback(() => {
    setError(undefined);
    reset();
  }, [reset]);

  const deleteScreenshot = useCallback(
    async (id: string) => {
      if (!storyData) return;

      setError(undefined);
      try {
        await mutateAsync({
          filePath: storyData.filePath,
          screenshotId: id,
          storyId: storyData.id,
        });
        deleteScreenshotFromStore(id);
      } catch {
        return;
      }
    },
    [mutateAsync, storyData],
  );

  return {
    clearError,
    deleteScreenshot,
    error,
    inProgress,
  };
};

import { useCallback } from 'react';
import { trpcClient } from '../../../api/trpc/client';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { toast } from '../../../utils/toast';
import { removeStoryScreenshots } from '../store/index';

export function useDeleteStoryScreenshot() {
  const { mutateAsync, isPending: deleteInProgress } =
    trpcClient.screenshot.deleteStoryScreenshots.useMutation({
      onError: (error) => {
        toast.error(error.message || 'Unexpected error occurred');
      },
      onSuccess: () => {
        toast.success('Story screenshots deleted successfully.');
      },
    });

  const data = useCurrentStoryData();

  const deleteStoryScreenshots = useCallback(async () => {
    if (!data) return;

    try {
      await mutateAsync({
        filePath: data.filePath,
        storyId: data.id,
      });
      removeStoryScreenshots();
    } catch {}
  }, [data, mutateAsync]);

  return {
    deleteInProgress,
    deleteStoryScreenshots,
  };
}

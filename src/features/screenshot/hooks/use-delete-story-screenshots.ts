import { trpcClient } from '../../../api';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { useCallback } from 'react';
import { removeStoryScreenshots } from '../store/index';
import { toast } from '../../../utils/toast';

export const useDeleteStoryScreenshot = () => {
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
    try {
      await mutateAsync({
        filePath: data.filePath,
        storyId: data.id,
      });
      removeStoryScreenshots();
    } catch {
      return;
    }
  }, [data, mutateAsync]);

  return {
    deleteInProgress,
    deleteStoryScreenshots,
  };
};

import { useState, useCallback } from 'react';
import { useCurrentStoryData } from './use-current-story-data';
import { deleteScreenshot as deleteScreenshotService } from '../api/client';
import { useScreenshotDispatch } from '../store/screenshot';

export const useDeleteScreenshot = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const storyData = useCurrentStoryData();

  const dispatch = useScreenshotDispatch();

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  const deleteScreenshot = useCallback(
    async (hash: string) => {
      clearError();
      setLoading(true);
      try {
        await deleteScreenshotService({
          fileName: storyData.parameters.fileName,
          hash: hash,
          storyId: storyData.id,
        });
        dispatch({ screenshotHash: hash, type: 'deleteScreenshot' });
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    },
    [dispatch, storyData, clearError],
  );

  return { clearError, deleteScreenshot, error, loading };
};

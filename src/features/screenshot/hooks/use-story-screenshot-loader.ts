import { useEffect, useCallback, useRef } from 'react';
import { trpcClient } from '../../../api/trpc/client';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { setScreenshots } from '../store/index';
import { toast } from '../../../utils/toast';
import { ScreenshotData } from '../../../typings';

export const useStoryScreenshotLoader = () => {
  const loadedStoryId = useRef<string>();

  const storyData = useCurrentStoryData();

  const { mutateAsync, isPending: screenshotLoaderInProgress } =
    trpcClient.screenshot.getStoryScreenshots.useMutation({
      onError: (error) => {
        toast.error(error.message || 'Unexpected error occurred');
      },
    });

  const loadScreenShots = useCallback(async () => {
    if (!storyData) return;

    try {
      const result = await mutateAsync({
        filePath: storyData.filePath,
        storyId: storyData.id,
      });
      loadedStoryId.current = storyData.id;
      setScreenshots((result || []) as ScreenshotData[]);
    } catch {
      return;
    }
  }, [mutateAsync, storyData]);

  useEffect(() => {
    if (screenshotLoaderInProgress || !storyData) return;
    if (loadedStoryId.current && loadedStoryId.current === storyData.id) {
      return;
    }
    loadScreenShots();
  }, [loadScreenShots, screenshotLoaderInProgress, storyData]);

  return {
    error: undefined,
    loadScreenShots,
    screenshotLoaderInProgress,
    storyData,
  };
};

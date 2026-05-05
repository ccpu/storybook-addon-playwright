import { useCallback } from 'react';
import { trpcClient } from '../../../api/trpc/client';
import { addImageDiffResult, setImageDiffResults } from '../store/actions';
import { nanoid } from 'nanoid';
import { ScreenshotTestTargetType } from '../../../typings';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { toast } from '../../../utils/toast';

export const useScreenshotDiffTestByType = () => {
  const storyData = useCurrentStoryData();

  const { mutateAsync, isPending: imageDiffTestInProgress } =
    trpcClient.screenshot.testScreenshots.useMutation({
      onError: (error) => {
        const message = error.message || 'Unexpected error occurred';
        toast.error(message);
      },
    });

  const testStoryScreenShots = useCallback(
    async (type: ScreenshotTestTargetType) => {
      if (!storyData) {
        return undefined;
      }

      try {
        const results = await mutateAsync({
          filePath: storyData.filePath,
          requestId: nanoid(),
          requestType: type,
          storyId: storyData.id,
        });
        if (type === 'file' || type === 'story') {
          results.forEach((result) => {
            addImageDiffResult(result);
          });
        } else {
          setImageDiffResults(results);
        }
        return results;
      } catch {
        return undefined;
      }
    },
    [mutateAsync, storyData],
  );

  return {
    imageDiffTestInProgress,
    storyData,
    testStoryScreenShots,
  };
};

import { useCallback, useState } from 'react';
import { trpcClient } from '../../../api';
import { addImageDiffResult, setImageDiffResults } from '../store/actions';
import { nanoid } from 'nanoid';
import { ScreenshotTestTargetType } from '../../../typings';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { toast } from '../../../utils/toast';

export const useScreenshotImageDiffResults = () => {
  const storyData = useCurrentStoryData();

  const [storyImageDiffError, setStoryImageDiffError] = useState<
    string | undefined
  >(undefined);

  const { mutateAsync, isPending: imageDiffTestInProgress } =
    trpcClient.screenshot.testScreenshots.useMutation({
      onError: (error) => {
        const message = error.message || 'Unexpected error occurred';
        setStoryImageDiffError(message);
        toast.error(message);
      },
    });

  const clearImageDiffError = useCallback(() => {
    setStoryImageDiffError(undefined);
  }, []);

  const testStoryScreenShots = useCallback(
    async (type: ScreenshotTestTargetType) => {
      setStoryImageDiffError(undefined);
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
    clearImageDiffError,
    imageDiffTestInProgress,
    storyData,
    storyImageDiffError,
    testStoryScreenShots,
  };
};

import { useCallback, useState } from 'react';
import { addImageDiffResult } from '../store/index';
import { trpcClient } from '../../../api';
import { StoryData } from '../../../schema';
import { toast } from '../../../utils/toast';

export const useScreenshotImageDiff = (storyData: StoryData) => {
  const [testScreenshotError, setTestScreenshotError] = useState<
    string | undefined
  >(undefined);

  const { mutateAsync, isPending: inProgress } =
    trpcClient.screenshot.testScreenshot.useMutation({
      onError: (error) => {
        const message = error.message || 'Unexpected error occurred';
        setTestScreenshotError(message);
        toast.error(message);
      },
    });

  const testScreenshot = useCallback(
    async (id: string) => {
      setTestScreenshotError(undefined);
      try {
        const result = await mutateAsync({
          filePath: storyData.filePath,
          screenshotId: id,
          storyId: storyData.id,
        });
        addImageDiffResult(result);
        return result;
      } catch {
        return undefined;
      }
    },
    [mutateAsync, storyData],
  );

  return {
    inProgress,
    testScreenshot,
    testScreenshotError,
  };
};

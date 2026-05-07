import type { StoryData } from '../../../schema';
import { useCallback, useState } from 'react';
import { trpcClient } from '../../../api/trpc/client';
import { toast } from '../../../utils/toast';
import { addImageDiffResult } from '../store/index';

export function useScreenshotDiffTest() {
  const [testScreenshotError, setTestScreenshotError] = useState<string | undefined>(
    undefined,
  );

  const {
    mutateAsync,
    isPending: inProgress,
    reset,
    data,
  } = trpcClient.screenshot.testScreenshot.useMutation({
    onError: (error) => {
      const message = error.message || 'Unexpected error occurred';
      setTestScreenshotError(message);
      toast.error(message);
    },
  });

  const testScreenshot = useCallback(
    async (storyData: StoryData & { screenshotId: string }) => {
      setTestScreenshotError(undefined);
      try {
        const result = await mutateAsync({
          ...storyData,
          screenshotId: storyData.screenshotId,
          storyId: storyData.id,
        });
        addImageDiffResult(result);
        return result;
      } catch {
        return undefined;
      }
    },
    [mutateAsync],
  );

  return {
    inProgress,
    reset,
    result: data,
    testScreenshot,
    testScreenshotError,
  };
}

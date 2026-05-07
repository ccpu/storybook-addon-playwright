import type { ImageDiffResult } from '../../../api/typings';
import { useCallback } from 'react';
import { trpcClient } from '../../../api/trpc/client';
import { toast } from '../../../utils/toast';
import { updateImageDiffResult } from '../store/index';

export function useScreenshotUpdate(successMessage?: string) {
  const {
    mutateAsync,
    isPending: updateScreenshotInProgress,
    reset,
  } = trpcClient.screenshot.updateScreenshot.useMutation({
    onError: (error) => {
      toast.error(error.message || 'Unexpected error occurred');
    },
    onSuccess: () => {
      if (successMessage) {
        toast.success(successMessage);
      }
    },
  });

  const updateScreenshotClearResult = useCallback(() => {
    reset();
  }, [reset]);

  const updateScreenshot = useCallback(
    async (imageDiffResult: ImageDiffResult) => {
      if (
        !imageDiffResult.filePath ||
        !imageDiffResult.screenshotId ||
        !imageDiffResult.storyId
      ) {
        return;
      }

      try {
        await mutateAsync({
          base64: imageDiffResult.newScreenshot,
          filePath: imageDiffResult.filePath,
          screenshotId: imageDiffResult.screenshotId,
          storyId: imageDiffResult.storyId,
        });
      } catch {
        return;
      }

      const newImageDiffResult: ImageDiffResult = {
        diffSize: false,
        filePath: imageDiffResult.filePath,
        index: imageDiffResult.index,
        newScreenshot: imageDiffResult.newScreenshot,
        pass: true,
        screenshotId: imageDiffResult.screenshotId,
        storyId: imageDiffResult.storyId,
      };

      updateImageDiffResult(newImageDiffResult);
    },
    [mutateAsync],
  );

  return {
    updateScreenshot,
    updateScreenshotClearResult,
    updateScreenshotInProgress,
  };
}

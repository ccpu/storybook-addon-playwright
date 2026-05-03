import { useCallback } from 'react';
import { updateImageDiffResult } from '../store/index';
import { ImageDiffResult } from '../../../api/typings';
import { trpcClient } from '../../../api';
import { toast } from '../../../utils/toast';

export const useScreenshotUpdate = (successMessage?: string) => {
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
};

import { useCallback } from 'react';
import { useAsyncApiCall } from '../../../hooks/use-async-api-call';
import { testScreenshots } from '../../../api/trpc/clients/screenshot.client';
import { addImageDiffResult, setImageDiffResults } from '../store/actions';
import { nanoid } from 'nanoid';
import { ScreenshotTestTargetType } from '../../../typings';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';

export const useScreenshotImageDiffResults = () => {
  const storyData = useCurrentStoryData();

  const {
    inProgress: imageDiffTestInProgress,
    makeCall,
    clearError: clearImageDiffError,
    error: storyImageDiffError,
    ErrorSnackbar,
  } = useAsyncApiCall(testScreenshots, false);

  const testStoryScreenShots = useCallback(
    async (type: ScreenshotTestTargetType) => {
      const results = await makeCall({
        fileName: storyData.fileName,
        requestId: nanoid(),
        requestType: type,
        storyId: storyData.id,
      });

      if (!(results instanceof Error)) {
        if (type === 'file' || type === 'story') {
          results.forEach((result) => {
            addImageDiffResult(result);
          });
        } else {
          setImageDiffResults(results);
        }
      }
      return results;
    },
    [makeCall, storyData],
  );

  return {
    ErrorSnackbar,
    clearImageDiffError,
    imageDiffTestInProgress,
    storyData,
    storyImageDiffError,
    testStoryScreenShots,
  };
};

import { useCallback } from 'react';
import { useAsyncApiCall } from './use-async-api-call';
import { testStoryScreenshots } from '../api/client';
import { StoryData } from '../typings';
import { nanoid } from 'nanoid';

export const useStoryScreenshotImageDiff = (storyData: StoryData) => {
  const {
    inProgress: imageDiffTestInProgress,
    makeCall,
    clearError: clearImageDiffError,
    error: storyImageDiffError,
  } = useAsyncApiCall(testStoryScreenshots, false);

  const testStoryScreenShots = useCallback(async () => {
    const results = await makeCall({
      fileName: storyData.parameters.fileName,
      requestId: nanoid(),
      storyId: storyData.id,
    });
    return results;
  }, [makeCall, storyData]);

  return {
    clearImageDiffError,
    imageDiffTestInProgress,
    storyImageDiffError,
    testStoryScreenShots,
  };
};

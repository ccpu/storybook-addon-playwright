import { useCallback } from 'react';
import { useScreenshotDispatch } from '../store/screenshot';
import { useAsyncApiCall } from './use-async-api-call';
import { testStoryScreenshots } from '../api/client';
import { StoryData } from '../typings';

export const useStoryScreenshotImageDiff = (storyData: StoryData) => {
  const dispatch = useScreenshotDispatch();

  const {
    inProgress: imageDiffTestInProgress,
    makeCall,
    clearError: clearImageDiffError,
    clearResult: clearImageDiffResult,
    error: storyImageDiffError,
  } = useAsyncApiCall(testStoryScreenshots, false);

  const testStoryScreenShots = useCallback(async () => {
    const results = await makeCall({
      fileName: storyData.parameters.fileName,
      storyId: storyData.id,
    });

    if (!(results instanceof Error)) {
      dispatch({
        imageDiffResults: results,
        type: 'setImageDiffResults',
      });
    }
    clearImageDiffResult();
    return results;
  }, [clearImageDiffResult, dispatch, makeCall, storyData]);

  return {
    clearImageDiffError,
    imageDiffTestInProgress,
    storyImageDiffError,
    testStoryScreenShots,
  };
};

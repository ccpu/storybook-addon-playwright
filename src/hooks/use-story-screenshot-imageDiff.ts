import { useCallback } from 'react';
import { useScreenshotDispatch } from '../store/screenshot';
import { useAsyncApiCall } from './use-async-api-call';
import { testStoryScreenshots } from '../api/client';
import { StoryData } from '../typings';
import { nanoid } from 'nanoid';

export const useStoryScreenshotImageDiff = (storyData: StoryData) => {
  const dispatch = useScreenshotDispatch();

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

    if (!(results instanceof Error)) {
      dispatch({
        imageDiffResults: results,
        type: 'setImageDiffResults',
      });
    }

    return results;
  }, [dispatch, makeCall, storyData]);

  return {
    clearImageDiffError,
    imageDiffTestInProgress,
    storyImageDiffError,
    testStoryScreenShots,
  };
};

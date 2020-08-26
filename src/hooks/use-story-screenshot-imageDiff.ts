import { useCallback } from 'react';
import { useAsyncApiCall } from './use-async-api-call';
import { testStoryScreenshots } from '../api/client';
import { StoryData } from '../typings';
import { nanoid } from 'nanoid';
import { useGlobalScreenshotDispatch } from './use-global-screenshot-dispatch';

export const useStoryScreenshotImageDiff = (storyData: StoryData) => {
  const { dispatch } = useGlobalScreenshotDispatch();

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
      console.log(results);
      if (results) {
        results.forEach((result) => {
          dispatch({
            imageDiffResult: result,
            type: 'addImageDiffResult',
          });
        });
      }
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

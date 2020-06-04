import { useCallback } from 'react';
import { useAsyncApiCall } from './use-async-api-call';
import { testAppScreenshots } from '../api/client';
import { useGlobalScreenshotDispatch } from './use-global-screenshot-dispatch';

export const useAppScreenshotImageDiff = () => {
  const { dispatch } = useGlobalScreenshotDispatch();

  const {
    inProgress: imageDiffTestInProgress,
    makeCall,
    clearError: clearImageDiffError,
    error: storyImageDiffError,
  } = useAsyncApiCall(testAppScreenshots, false);

  const testStoryScreenShots = useCallback(async () => {
    const results = await makeCall();

    if (!(results instanceof Error)) {
      dispatch({
        imageDiffResults: results,
        type: 'setImageDiffResults',
      });
    }
  }, [dispatch, makeCall]);

  return {
    clearImageDiffError,
    imageDiffTestInProgress,
    storyImageDiffError,
    testStoryScreenShots,
  };
};

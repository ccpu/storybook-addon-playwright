import { useCallback } from 'react';
import { useAsyncApiCall } from './use-async-api-call';
import { testAppScreenshots } from '../api/client';
import { useGlobalScreenshotDispatch } from './use-global-screenshot-dispatch';
import { nanoid } from 'nanoid';

export const useAppScreenshotImageDiff = () => {
  const { dispatch } = useGlobalScreenshotDispatch();

  const {
    inProgress: imageDiffTestInProgress,
    makeCall,
    clearError: clearImageDiffError,
    error: storyImageDiffError,
    ErrorSnackbar,
  } = useAsyncApiCall(testAppScreenshots, false);

  const testStoryScreenShots = useCallback(async () => {
    const results = await makeCall({ requestId: nanoid() });
    if (!(results instanceof Error)) {
      dispatch({
        imageDiffResults: results,
        type: 'setImageDiffResults',
      });
    }
    return results;
  }, [dispatch, makeCall]);

  return {
    ErrorSnackbar,
    clearImageDiffError,
    imageDiffTestInProgress,
    storyImageDiffError,
    testStoryScreenShots,
  };
};

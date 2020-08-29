import { useCallback } from 'react';
import { useAsyncApiCall } from './use-async-api-call';
import { testScreenshots } from '../api/client';
import { useGlobalScreenshotDispatch } from './use-global-screenshot-dispatch';
import { nanoid } from 'nanoid';

export const useScreenshotImageDiffResults = () => {
  const { dispatch } = useGlobalScreenshotDispatch();

  const {
    inProgress: imageDiffTestInProgress,
    makeCall,
    clearError: clearImageDiffError,
    error: storyImageDiffError,
    ErrorSnackbar,
  } = useAsyncApiCall(testScreenshots, false);

  const testStoryScreenShots = useCallback(
    async (storyFileName?: string) => {
      const results = await makeCall({
        fileName: storyFileName,
        requestId: nanoid(),
      });
      if (!(results instanceof Error)) {
        if (storyFileName) {
          results.forEach((result) => {
            dispatch({
              imageDiffResult: result,
              type: 'addImageDiffResult',
            });
          });
        } else {
          dispatch({
            imageDiffResults: results,
            type: 'setImageDiffResults',
          });
        }
      }
      return results;
    },
    [dispatch, makeCall],
  );

  return {
    ErrorSnackbar,
    clearImageDiffError,
    imageDiffTestInProgress,
    storyImageDiffError,
    testStoryScreenShots,
  };
};

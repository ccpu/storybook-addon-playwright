import { useCallback } from 'react';
import { useAsyncApiCall } from './use-async-api-call';
import { testScreenshots } from '../api/client';
import { useGlobalScreenshotDispatch } from './use-global-screenshot-dispatch';
import { nanoid } from 'nanoid';
import { ScreenshotTestType } from '../typings';
import { useCurrentStoryData } from './use-current-story-data';

export const useScreenshotImageDiffResults = () => {
  const { dispatch } = useGlobalScreenshotDispatch();

  const storyInfo = useCurrentStoryData();

  const {
    inProgress: imageDiffTestInProgress,
    makeCall,
    clearError: clearImageDiffError,
    error: storyImageDiffError,
    ErrorSnackbar,
  } = useAsyncApiCall(testScreenshots, false);

  const testStoryScreenShots = useCallback(
    async (type: ScreenshotTestType) => {
      const results = await makeCall({
        fileName: storyInfo.parameters.fileName,
        requestId: nanoid(),
        requestType: type,
        storyId: storyInfo.id,
      });

      if (!(results instanceof Error)) {
        if (type === 'file' || type === 'story') {
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
    [dispatch, makeCall, storyInfo],
  );

  return {
    ErrorSnackbar,
    clearImageDiffError,
    imageDiffTestInProgress,
    storyImageDiffError,
    storyInfo,
    testStoryScreenShots,
  };
};

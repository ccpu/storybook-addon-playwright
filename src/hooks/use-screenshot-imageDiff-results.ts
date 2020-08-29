import { useCallback } from 'react';
import { useAsyncApiCall } from './use-async-api-call';
import { testScreenshots } from '../api/client';
import { useGlobalScreenshotDispatch } from './use-global-screenshot-dispatch';
import { nanoid } from 'nanoid';
import { ScreenshotTestTargetType } from '../typings';
import { useCurrentStoryData } from './use-current-story-data';

export const useScreenshotImageDiffResults = () => {
  const { dispatch } = useGlobalScreenshotDispatch();

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
        fileName: storyData.parameters.fileName,
        requestId: nanoid(),
        requestType: type,
        storyId: storyData.id,
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
    [dispatch, makeCall, storyData],
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

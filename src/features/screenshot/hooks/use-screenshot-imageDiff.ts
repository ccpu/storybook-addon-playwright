import { useCallback } from 'react';
import { useScreenshotDispatch } from '../store/index';
import { useAsyncApiCall } from '../../../hooks/use-async-api-call';
import { testScreenshot as testScreenshotClient } from '../../../api/trpc/clients/screenshot.client';
import { StoryData } from '../../../typings';

export const useScreenshotImageDiff = (storyData: StoryData) => {
  const dispatch = useScreenshotDispatch();

  const {
    makeCall,
    error: testScreenshotError,
    inProgress,
    ErrorSnackbar,
  } = useAsyncApiCall(testScreenshotClient, false);

  const testScreenshot = useCallback(
    async (id: string) => {
      const result = await makeCall({
        fileName: storyData.parameters.fileName,
        screenshotId: id,
        storyId: storyData.id,
      });
      if (!(result instanceof Error)) {
        dispatch({
          imageDiffResult: result,
          type: 'addImageDiffResult',
        });
      }
      return result;
    },
    [dispatch, makeCall, storyData],
  );

  return {
    TestScreenshotErrorSnackbar: ErrorSnackbar,
    inProgress,
    testScreenshot,
    testScreenshotError,
  };
};

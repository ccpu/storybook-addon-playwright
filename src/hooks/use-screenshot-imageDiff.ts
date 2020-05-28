import { useCallback } from 'react';
import { useScreenshotDispatch } from '../store/screenshot';
import { useAsyncApiCall } from './use-async-api-call';
import { testScreenshot as testScreenshotClient } from '../api/client';
import { StoryInput } from '../typings';

export const useScreenshotImageDiff = (storyData: StoryInput) => {
  const dispatch = useScreenshotDispatch();

  const {
    makeCall,
    error: testScreenshotError,
    inProgress,
    clearResult,
  } = useAsyncApiCall(testScreenshotClient, false);

  const testScreenshot = useCallback(
    async (hash: string) => {
      const result = await makeCall({
        fileName: storyData.parameters.fileName,
        hash,
        storyId: storyData.id,
      });
      if (!(result instanceof Error)) {
        dispatch({
          imageDiffResult: result,
          type: 'addImageDiffResult',
        });
      }
    },
    [dispatch, makeCall, storyData],
  );

  return {
    clearResult,
    inProgress,
    testScreenshot,
    testScreenshotError,
  };
};

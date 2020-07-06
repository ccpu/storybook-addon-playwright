import { useEffect, useCallback, useRef } from 'react';
import { getStoryScreenshots } from '../api/client/get-story-screenshots';
import { useCurrentStoryData } from './use-current-story-data';
import { useScreenshotDispatch } from '../store/screenshot';
import { useAsyncApiCall } from './use-async-api-call';

export const useStoryScreenshotLoader = () => {
  const dispatch = useScreenshotDispatch();

  const loadedStoryId = useRef<string>();

  const storyData = useCurrentStoryData();

  const {
    makeCall,
    error,
    inProgress: screenshotLoaderInProgress,
    ErrorSnackbar: ScreenshotLoaderErrorSnackbar,
    SuccessSnackbar: ScreenshotLoaderSuccessSnackbar,
  } = useAsyncApiCall(getStoryScreenshots, false);

  const loadScreenShots = useCallback(async () => {
    const result = await makeCall({
      fileName: storyData.parameters.fileName,
      storyId: storyData.id,
    });
    if (result instanceof Error) return;
    loadedStoryId.current = storyData.id;
    dispatch({ screenshots: result, type: 'setScreenshots' });
  }, [dispatch, makeCall, storyData]);

  useEffect(() => {
    if (
      screenshotLoaderInProgress ||
      !storyData ||
      !storyData.parameters ||
      error
    )
      return;
    if (loadedStoryId.current && loadedStoryId.current === storyData.id) {
      return;
    }
    loadScreenShots();
  }, [dispatch, error, loadScreenShots, screenshotLoaderInProgress, storyData]);

  return {
    ScreenshotLoaderErrorSnackbar,
    ScreenshotLoaderSuccessSnackbar,
    error,
    loadScreenShots,
    screenshotLoaderInProgress,
    storyData,
  };
};

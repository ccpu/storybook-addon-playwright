import { useEffect, useCallback, useRef } from 'react';
import { getStoryScreenshots } from '../../../api/trpc/clients/screenshot.client';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { setScreenshots } from '../store/index';
import { useAsyncApiCall } from '../../../hooks/use-async-api-call';

export const useStoryScreenshotLoader = () => {
  const loadedStoryId = useRef<string>();

  const storyData = useCurrentStoryData();

  const {
    makeCall,
    error,
    inProgress: screenshotLoaderInProgress,
    ErrorSnackbar: ScreenshotLoaderErrorSnackbar,
  } = useAsyncApiCall(getStoryScreenshots, false);

  const loadScreenShots = useCallback(async () => {
    const result = await makeCall({
      filePath: storyData.filePath,
      storyId: storyData.id,
    });

    if (result instanceof Error) return;
    loadedStoryId.current = storyData.id;
    setScreenshots(result);
  }, [makeCall, storyData]);

  useEffect(() => {
    if (screenshotLoaderInProgress || !storyData || error) return;
    if (loadedStoryId.current && loadedStoryId.current === storyData.id) {
      return;
    }
    loadScreenShots();
  }, [error, loadScreenShots, screenshotLoaderInProgress, storyData]);

  return {
    ScreenshotLoaderErrorSnackbar,
    error,
    loadScreenShots,
    screenshotLoaderInProgress,
    storyData,
  };
};

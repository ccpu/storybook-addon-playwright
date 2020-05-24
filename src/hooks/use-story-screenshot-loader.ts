import { useState, useEffect, useCallback, useRef } from 'react';
import { getStoryScreenshots } from '../api/client/get-story-screenshots';
import { useCurrentStoryData } from './use-current-story-data';
import { useScreenshotDispatch } from '../store/screenshot';
import { useRetry } from './use-retry';

export const useStoryScreenshotLoader = () => {
  const dispatch = useScreenshotDispatch();

  const [error, setError] = useState<string>();

  const { retry, retryEnd, doRetry } = useRetry();

  const [loading, setLoading] = useState(false);
  const loadedStoryId = useRef<string>();

  const storyData = useCurrentStoryData();

  useEffect(() => {
    if (loading || !storyData || (error && !retry)) return;
    if (
      !retry &&
      loadedStoryId.current &&
      loadedStoryId.current === storyData.id
    ) {
      return;
    }
    retryEnd();

    setLoading(true);
    setError(undefined);
    getStoryScreenshots({
      fileName: storyData.parameters.fileName,
      storyId: storyData.id,
    })
      .then((data) => {
        loadedStoryId.current = storyData.id;
        dispatch({ screenshots: data, type: 'setScreenshots' });
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, error, loading, retry, retryEnd, storyData]);

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  return { clearError, doRetry, error, loading };
};

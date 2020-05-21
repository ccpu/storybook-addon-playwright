import { useState, useEffect, useCallback } from 'react';

import { getStoryScreenshots } from '../api/client/get-story-screenshots';
import { useCurrentStoryData } from './use-current-story-data';
import { useScreenshotDispatch } from '../store/screenshot';

export const useStoryScreenshotLoader = () => {
  const dispatch = useScreenshotDispatch();

  const [error, setError] = useState<string>();

  const [loading, setLoading] = useState(false);

  const storyData = useCurrentStoryData();

  useEffect(() => {
    if (loading || !storyData) return;
    setLoading(true);
    getStoryScreenshots({
      fileName: storyData.parameters.fileName,
      storyId: storyData.id,
    })
      .then((data) => {
        dispatch({ screenshots: data, type: 'setScreenshots' });
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, loading, storyData]);

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  return { clearError, error, loading };
};

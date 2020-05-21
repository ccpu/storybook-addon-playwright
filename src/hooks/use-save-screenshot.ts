import { useCallback, useState } from 'react';
import { useKnobs } from './use-knobs';
import { useCurrentActions } from './use-current-actions';
import { useCurrentStoryData } from './use-current-story-data';
import { saveScreenshot as saveScreenshotClient } from '../api/client';
import { BrowserTypes } from '../typings';
import { getSnapshotHash } from '../utils';

export const useSaveScreenshot = () => {
  const knobs = useKnobs();
  const storyData = useCurrentStoryData();

  const { currentActions } = useCurrentActions(storyData && storyData.id);
  const [error, setError] = useState();

  const saveScreenShot = useCallback(
    async (
      browserType: BrowserTypes,
      description: string,
      base64String?: string,
    ) => {
      try {
        await saveScreenshotClient({
          actions: currentActions,
          base64: base64String,
          browserType,
          description,
          fileName: storyData.parameters.fileName,
          hash: getSnapshotHash(
            storyData.id,
            description,
            currentActions,
            knobs,
          ),
          knobs,
          storyId: storyData.id,
        });
      } catch (error) {
        setError(error.message);
      }
    },
    [currentActions, knobs, storyData],
  );

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  return { clearError, error, saveScreenShot };
};

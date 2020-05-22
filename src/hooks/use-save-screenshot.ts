import { useCallback, useState } from 'react';
import { useKnobs } from './use-knobs';
import { useCurrentActions } from './use-current-actions';
import { useCurrentStoryData } from './use-current-story-data';
import { saveScreenshot as saveScreenshotClient } from '../api/client';
import { BrowserTypes } from '../typings';
import { getSnapshotHash } from '../utils';
import { ImageDiff, SaveScreenshotRequest } from '../api/typings';
import { useGlobalScreenshotDispatch } from './use-global-screenshot-dispatch';

export const useSaveScreenshot = () => {
  const knobs = useKnobs();
  const storyData = useCurrentStoryData();

  const { dispatch } = useGlobalScreenshotDispatch();

  const { currentActions } = useCurrentActions(storyData && storyData.id);
  const [error, setError] = useState();
  const [result, setResult] = useState<ImageDiff>();

  const saveScreenShot = useCallback(
    async (
      browserType: BrowserTypes,
      description: string,
      base64String?: string,
    ) => {
      try {
        const data: SaveScreenshotRequest = {
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
        };
        const result = await saveScreenshotClient(data);
        if (result.added) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { base64, ...rest } = data;
          dispatch({ screenshot: rest, type: 'addScreenshot' });
        }
        console.log(result);
        setResult(result);
      } catch (error) {
        setError(error.message);
      }
    },
    [currentActions, knobs, storyData, dispatch],
  );

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  const clearResult = useCallback(() => {
    setResult(undefined);
  }, []);

  return { clearError, clearResult, error, result, saveScreenShot };
};

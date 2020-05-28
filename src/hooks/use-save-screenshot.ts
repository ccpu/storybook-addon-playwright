import { useCallback, useState } from 'react';
import { useKnobs } from './use-knobs';
import { useCurrentActions } from './use-current-actions';
import { useCurrentStoryData } from './use-current-story-data';
import { saveScreenshot as saveScreenshotClient } from '../api/client';
import { BrowserTypes, DeviceDescriptor } from '../typings';
import { getSnapshotHash } from '../utils';
import { ImageDiffResult, SaveScreenshotRequest } from '../api/typings';
import { useGlobalScreenshotDispatch } from './use-global-screenshot-dispatch';

export const useSaveScreenshot = () => {
  const knobs = useKnobs();
  const storyData = useCurrentStoryData();

  const { dispatch } = useGlobalScreenshotDispatch();

  const { currentActions } = useCurrentActions(storyData && storyData.id);
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<ImageDiffResult>();
  const [saving, setWorking] = useState(false);

  const saveScreenShot = useCallback(
    async (
      browserType: BrowserTypes,
      title: string,
      base64String?: string,
      deviceDescriptor?: DeviceDescriptor,
    ) => {
      const hash = getSnapshotHash(
        storyData.id,
        currentActions,
        knobs,
        browserType,
        deviceDescriptor,
      );

      try {
        const data: SaveScreenshotRequest = {
          actions: currentActions,
          base64: base64String,
          browserType,
          device: deviceDescriptor,
          fileName: storyData.parameters.fileName,
          hash,
          knobs: knobs,
          storyId: storyData.id,
          title,
        };
        setWorking(true);
        const result = await saveScreenshotClient(data);

        if (result.added) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { base64, ...rest } = data;
          dispatch({ screenshot: rest, type: 'addScreenshot' });
        }

        setResult(result);
      } catch (error) {
        setError(error.message);
      }
      setWorking(false);
    },
    [currentActions, knobs, storyData, dispatch],
  );

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  const clearResult = useCallback(() => {
    setResult(undefined);
  }, []);

  return { clearError, clearResult, error, result, saveScreenShot, saving };
};

import { useCallback, useState } from 'react';
import { useKnobs } from '../../../hooks/use-knobs';
import { useCurrentActions } from '../../action-set/hooks/use-current-actions';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { trpcClient } from '../../../api';
import { BrowserTypes, BrowserContextOptions } from '../../../typings';
import { SaveScreenshotRequest } from '../../../api/typings';
import { removeScreenshot, addScreenshot } from '../store/actions';
import { useEditScreenshot } from './use-edit-screenshot';
import { useScreenshotOptions } from './use-screenshot-options';
import { nanoid } from 'nanoid';
import { toast } from '../../../utils/toast';

export const useSaveScreenshot = () => {
  const props = useKnobs();

  const { screenshotOptions } = useScreenshotOptions();

  const storyData = useCurrentStoryData();

  const { editScreenshotState, clearScreenshotEdit } = useEditScreenshot();

  const { currentActions } = useCurrentActions(storyData && storyData.id);

  const [error, setError] = useState<string | undefined>(undefined);

  const {
    mutateAsync,
    data: result,
    reset,
    isPending: inProgress,
  } = trpcClient.screenshot.saveScreenshot.useMutation({
    onError: (mutationError) => {
      const message = mutationError.message || 'Unexpected error occurred';
      setError(message);
      toast.error(message);
    },
  });

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  const clearResult = useCallback(() => {
    reset();
  }, [reset]);

  const isUpdating = useCallback(
    (browserType: BrowserTypes) => {
      if (!editScreenshotState) return false;
      if (editScreenshotState.screenshotData.browserType === browserType)
        return true;
      return false;
    },
    [editScreenshotState],
  );

  const getUpdatingScreenshotTitle = useCallback(() => {
    return editScreenshotState && editScreenshotState.screenshotData.title;
  }, [editScreenshotState]);

  const saveScreenShot = useCallback(
    async (
      browserType: BrowserTypes,
      title: string,
      base64String?: string,
      deviceDescriptor?: BrowserContextOptions,
    ) => {
      const browserOptions = deviceDescriptor
        ? { ...deviceDescriptor }
        : undefined;

      const data: SaveScreenshotRequest = {
        actionSets: currentActions,
        base64: base64String,
        browserOptions,
        browserType,
        filePath: storyData.filePath,
        id: nanoid(12),
        props: props,
        screenshotOptions:
          screenshotOptions && Object.keys(screenshotOptions).length
            ? screenshotOptions
            : undefined,
        storyId: storyData.id,
        title,
      };

      if (isUpdating(browserType)) {
        data.updateScreenshot = editScreenshotState.screenshotData;
      }

      let result;

      clearError();
      try {
        result = (await mutateAsync(data)) || {};
      } catch {
        return new Error('Unexpected error occurred');
      }

      if (editScreenshotState && isUpdating(browserType)) {
        if (result.added) {
          removeScreenshot(editScreenshotState.screenshotData.id);
        }
        clearScreenshotEdit();
      }

      if (result.added) {
        data.index = result.index;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { base64, ...rest } = data;
        addScreenshot(rest);
      }
      return result;
    },
    [
      currentActions,
      props,
      screenshotOptions,
      storyData,
      isUpdating,
      editScreenshotState,
      mutateAsync,
      clearScreenshotEdit,
      clearError,
    ],
  );

  const onSuccessClose = useCallback(() => {
    clearResult();
  }, [clearResult]);

  return {
    clearError,
    error,
    getUpdatingScreenshotTitle,
    inProgress,
    isUpdating,
    onSuccessClose,
    result,
    saveScreenShot,
  };
};

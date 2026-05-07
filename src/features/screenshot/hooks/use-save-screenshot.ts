import type { SaveScreenshotRequest } from '../../../api/typings';
import type { BrowserContextOptions, BrowserTypes } from '../../../typings';
import { nanoid } from 'nanoid';
import { useCallback, useState } from 'react';
import { trpcClient } from '../../../api/trpc/client';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { useKnobs } from '../../../hooks/use-knobs';
import { getImageDiffMessages } from '../../../utils';
import { toast } from '../../../utils/toast';
import { useCurrentActions } from '../../action-set/hooks/use-current-actions';
import { addScreenshot, removeScreenshot } from '../store/actions';
import { useEditScreenshot } from './use-edit-screenshot';
import { useScreenshotOptions } from './use-screenshot-options';

interface Options {
  title?: string;
  browserType?: BrowserTypes;
}

export function useSaveScreenshot(options?: Options) {
  const { title, browserType } = options || {};
  const args = useKnobs();

  const { screenshotOptions } = useScreenshotOptions();

  const storyData = useCurrentStoryData();

  const { editScreenshotState, clearScreenshotEdit } = useEditScreenshot();

  const { currentActions } = useCurrentActions(storyData?.id ?? '');

  const [error, setError] = useState<string | undefined>(undefined);

  const {
    mutateAsync,
    data: mutationResult,
    reset,
    isPending: inProgress,
  } = trpcClient.screenshot.saveScreenshot.useMutation({
    onError: (mutationError) => {
      const message = mutationError.message || 'Unexpected error occurred';
      setError(message);
      toast.error(message);
    },
    onSettled(result, error) {
      if (error) {
        toast.error(
          error.message || 'Unexpected error occurred in saving screenshot',
        );
        return;
      }
      if (!result) return;
      const titleMsg = title || result.oldScreenShotTitle;
      if (result.added) {
        toast.success(
          // prettier-ignore
          `Screenshot ${ `${browserType ? ` for '${browserType}'` : ''}` } saved successfully.`,
          {
            duration: 5000,
            id: `image-diff-message:added:${browserType || 'default'}`,
            onAutoClose: reset,
            onDismiss: reset,
          },
        );
      } else if (result.pass) {
        const message =
          // prettier-ignore
          `Testing existing screenshot were successful, no change has been detected.${titleMsg ? `\nTitle: ${titleMsg}` : ''}${browserType ? `\nBrowser: ${  browserType}` : '' }`;

        toast.success(message, {
          duration: 5000,
          id: `image-diff-message:pass:${message}`,
          onAutoClose: reset,
          onDismiss: reset,
        });
      } else if (result.diffSize || result.error) {
        const message = getImageDiffMessages(result);

        toast.error(message, {
          duration: Infinity,
          id: `image-diff-message:error:${message}`,
          onDismiss: reset,
        });
      }
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

  const getUpdatingScreenshotTitle = useCallback(
    () => editScreenshotState && editScreenshotState.screenshotData.title,
    [editScreenshotState],
  );

  const saveScreenShot = useCallback(
    async (
      browserType: BrowserTypes,
      title: string,
      base64String?: string,
      deviceDescriptor?: BrowserContextOptions,
    ) => {
      if (!storyData) {
        return new Error('Unable to find story data');
      }

      if (!base64String) {
        return new Error('Unable to find screenshot image data');
      }

      const browserOptions = deviceDescriptor
        ? { ...deviceDescriptor }
        : undefined;

      const data: SaveScreenshotRequest = {
        actionSets: currentActions,
        args,
        base64: base64String,
        browserOptions,
        browserType,
        filePath: storyData.filePath,
        id: nanoid(12),
        props: args,
        screenshotOptions:
          screenshotOptions && Object.keys(screenshotOptions).length
            ? screenshotOptions
            : undefined,
        storyId: storyData.id,
        title,
      };

      if (editScreenshotState && isUpdating(browserType)) {
        data.updateScreenshot = editScreenshotState.screenshotData;
      }

      let saveResult;

      clearError();
      try {
        saveResult = await mutateAsync(data);
      } catch {
        return new Error('Unexpected error occurred');
      }

      if (editScreenshotState && isUpdating(browserType)) {
        if (saveResult.added) {
          removeScreenshot(editScreenshotState.screenshotData.id);
        }
        clearScreenshotEdit();
      }

      if (saveResult.added) {
        data.index = saveResult.index;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { base64, ...rest } = data;
        addScreenshot(rest);
      }
      return saveResult;
    },
    [
      currentActions,
      args,
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
    result: mutationResult,
    saveScreenShot,
  };
}

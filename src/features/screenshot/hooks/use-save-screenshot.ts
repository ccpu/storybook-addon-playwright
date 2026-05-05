import { useCallback, useState } from 'react';
import { useKnobs } from '../../../hooks/use-knobs';
import { useCurrentActions } from '../../action-set/hooks/use-current-actions';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { trpcClient } from '../../../api/trpc/client';
import { BrowserTypes, BrowserContextOptions } from '../../../typings';
import { SaveScreenshotRequest } from '../../../api/typings';
import { removeScreenshot, addScreenshot } from '../store/actions';
import { useEditScreenshot } from './use-edit-screenshot';
import { useScreenshotOptions } from './use-screenshot-options';
import { nanoid } from 'nanoid';
import { toast } from '../../../utils/toast';
import { getImageDiffMessages } from '../../../utils';

interface Options {
  title?: string;
  browserType?: BrowserTypes;
}

export const useSaveScreenshot = (options?: Options) => {
  const { title, browserType } = options || {};
  const props = useKnobs();

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
            autoClose: 5000,
            onClose: () => {
              reset();
            },
            toastId: `image-diff-message:added:${browserType || 'default'}`,
          },
        );
      } else if (result.pass) {
        const message =
          // prettier-ignore
          `Testing existing screenshot were successful, no change has been detected.${titleMsg ? `\nTitle: ${titleMsg}` : ''}${browserType ? `\nBrowser: ` + browserType : '' }`;

        toast.success(message, {
          autoClose: 5000,
          onClose: () => {
            reset();
          },
          toastId: `image-diff-message:pass:${message}`,
        });

        return;
      } else if (result.diffSize || result.error) {
        const message = getImageDiffMessages(result);

        toast.error(message, {
          autoClose: false,
          onClose: () => {
            reset();
          },
          toastId: `image-diff-message:error:${message}`,
        });
        return;
      }
    },
  });

  console.log(inProgress);

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
    result: mutationResult,
    saveScreenShot,
  };
};

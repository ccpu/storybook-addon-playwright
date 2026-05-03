import { useCallback } from 'react';
import { useKnobs } from '../../../hooks/use-knobs';
import { useCurrentActions } from '../../action-set/hooks/use-current-actions';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { saveScreenshot as saveScreenshotClient } from '../../../api/trpc/clients/screenshot.client';
import { BrowserTypes, BrowserContextOptions } from '../../../typings';
import { SaveScreenshotRequest } from '../../../api/typings';
import { removeScreenshot, addScreenshot } from '../store/actions';
import { useAsyncApiCall } from '../../../hooks/use-async-api-call';
import { useEditScreenshot } from './use-edit-screenshot';
import { useScreenshotOptions } from './use-screenshot-options';
import { nanoid } from 'nanoid';

export const useSaveScreenshot = () => {
  const props = useKnobs();

  const { screenshotOptions } = useScreenshotOptions();

  const storyData = useCurrentStoryData();

  const { editScreenshotState, clearScreenshotEdit } = useEditScreenshot();

  const { currentActions } = useCurrentActions(storyData && storyData.id);

  const {
    makeCall,
    result,
    clearError,
    clearResult,
    ErrorSnackbar,
    inProgress,
    error,
  } = useAsyncApiCall(saveScreenshotClient);

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

      const res = await makeCall(data);

      if (res instanceof Error) return res;

      const result = res || {};

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
      makeCall,
      clearScreenshotEdit,
    ],
  );

  const onSuccessClose = useCallback(() => {
    clearResult();
  }, [clearResult]);

  return {
    ErrorSnackbar,
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

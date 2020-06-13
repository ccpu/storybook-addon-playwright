import { useCallback } from 'react';
import { useKnobs } from './use-knobs';
import { useCurrentActions } from './use-current-actions';
import { useCurrentStoryData } from './use-current-story-data';
import { saveScreenshot as saveScreenshotClient } from '../api/client';
import { BrowserTypes, DeviceDescriptor } from '../typings';
import { getScreenshotHash } from '../utils';
import { SaveScreenshotRequest } from '../api/typings';
import { useGlobalScreenshotDispatch } from './use-global-screenshot-dispatch';
import { useAsyncApiCall } from './use-async-api-call';
import { useEditScreenshot } from './use-edit-screenshot';
import { useScreenshotOptions } from './use-screenshot-options';

export const useSaveScreenshot = () => {
  const props = useKnobs();

  const { screenshotOptions } = useScreenshotOptions();

  const storyData = useCurrentStoryData();

  const { dispatch: screenshotDispatch } = useGlobalScreenshotDispatch();

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
      deviceDescriptor?: DeviceDescriptor,
    ) => {
      const hash = getScreenshotHash({
        actions: currentActions,
        browserType,
        device: deviceDescriptor,
        options: screenshotOptions,
        props,
        storyId: storyData.id,
      });

      const data: SaveScreenshotRequest = {
        actions: currentActions,
        base64: base64String,
        browserType,
        device: deviceDescriptor,
        fileName: storyData.parameters.fileName,
        hash,
        options: Object.keys(screenshotOptions).length
          ? screenshotOptions
          : undefined,
        props: props,
        storyId: storyData.id,
        title,
        updateScreenshot:
          isUpdating(browserType) && editScreenshotState.screenshotData,
      };

      const res = await makeCall(data);

      if (res instanceof Error) return res;

      if (editScreenshotState && isUpdating(browserType)) {
        if (res.added) {
          screenshotDispatch({
            screenshotHash: editScreenshotState.screenshotData.hash,
            type: 'removeScreenshot',
          });
        }
        clearScreenshotEdit();
      }

      if (res.added) {
        data.index = res.index;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { base64, ...rest } = data;
        screenshotDispatch({
          screenshot: rest,
          type: 'addScreenshot',
        });
      }
      return res;
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
      screenshotDispatch,
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

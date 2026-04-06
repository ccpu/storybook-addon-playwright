import { useCallback } from 'react';
import { SortEnd } from 'react-sortable-hoc';
import { useAsyncApiCall } from '../../../hooks/use-async-api-call';
import { changeScreenShotIndex } from '../../../api/trpc/clients/screenshot.client';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { changeScreenshotIndex } from '../store/index';

export const useScreenshotIndexChange = () => {
  const {
    ErrorSnackbar: ChangeIndexErrorSnackbar,
    makeCall,
    inProgress: ChangeIndexInProgress,
  } = useAsyncApiCall(changeScreenShotIndex, false);

  const storyData = useCurrentStoryData();

  const changeIndex = useCallback(
    async (e: SortEnd) => {
      changeScreenshotIndex({ newIndex: e.newIndex, oldIndex: e.oldIndex });
      const result = await makeCall({
        fileName: storyData.parameters.fileName,
        newIndex: e.newIndex,
        oldIndex: e.oldIndex,
        storyId: storyData.id,
      });
      if (result instanceof Error) {
        changeScreenshotIndex({ newIndex: e.oldIndex, oldIndex: e.newIndex });
      }
    },
    [makeCall, storyData],
  );
  return {
    ChangeIndexErrorSnackbar,
    ChangeIndexInProgress,
    changeIndex,
  };
};
